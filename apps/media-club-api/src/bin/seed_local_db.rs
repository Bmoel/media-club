use std::env;
use std::collections::HashMap;
use aws_sdk_dynamodb::types::{AttributeDefinition, KeySchemaElement, KeyType, ScalarAttributeType, AttributeValue};
use std::env::var;


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();
    let media_table_name = var("DB_NAME_MEDIA").map_err(|_| "media table name not found")?;
    let users_table_name = var("DB_NAME_USERS").map_err(|_| "users table name not found")?;
    let media_table_pri_key = var("DB_NAME_MEDIA_PRI_KEY").map_err(|_| "media table pri key not found")?;
    let users_table_pri_key = var("DB_NAME_USERS_PRI_KEY").map_err(|_| "users table pri key not found")?;

    let args: Vec<String> = env::args().collect();
    let table_map = HashMap::from([
        (media_table_name.clone(), "./snapshots/media_snapshot.json".to_string()),
        (users_table_name.clone(), "./snapshots/users_snapshot.json".to_string())
    ]);
    let primary_key_map = HashMap::from([
        (media_table_name.clone(), media_table_pri_key.to_string()),
        (users_table_name.clone(), users_table_pri_key.to_string())
    ]);
    let primary_key_type_map = HashMap::from([
        (media_table_name.clone(), ScalarAttributeType::N),
        (users_table_name.clone(), ScalarAttributeType::N)
    ]);

    if args.len() != 2 {
        eprintln!("Usage: cargo run --bin seed -- tableName");
        eprintln!("tableName can be {}", get_tables_as_string(table_map));
        std::process::exit(1);
    }

    let table_name = &args[1];
    if !table_map.contains_key(table_name) {
        eprintln!("Error: Inputted tableName does not exist");
        eprintln!("tableName can be {}", get_tables_as_string(table_map));
        std::process::exit(1);
    }


    let config = aws_config::from_env()
        .endpoint_url("http://localhost:8000")
        .load()
        .await;
    let client = aws_sdk_dynamodb::Client::new(&config);

    let current_tables = client.list_tables().send().await.unwrap();
    let table_exists = current_tables.table_names().contains(&table_name.to_string());

    let primary_key = primary_key_map.get(table_name).expect("primary key does not exist");
    if table_exists {
        let items = client.scan().table_name(table_name).send().await.unwrap();
        
        for item in items.items.unwrap_or_default() {
            let id = item.get(primary_key).unwrap();
            
            client.delete_item()
                .table_name(table_name)
                .key(primary_key, id.clone())
                .send()
                .await
                .unwrap();
        }
    } else {
        println!("Table {} not found. Creating...", table_name);
        let primary_key_type = primary_key_type_map.get(table_name).expect("primary key type not found").clone();
        client.create_table()
            .table_name(table_name)
            .attribute_definitions(
                AttributeDefinition::builder()
                    .attribute_name(primary_key)
                    .attribute_type(primary_key_type)
                    .build()
                    .unwrap(),
            )
            .key_schema(
                KeySchemaElement::builder()
                    .attribute_name(primary_key)
                    .key_type(KeyType::Hash)
                    .build()
                    .unwrap(),
            )
            .billing_mode(aws_sdk_dynamodb::types::BillingMode::PayPerRequest)
            .send()
            .await
            .expect("failed to create table");
    }

    let file_path = table_map.get(table_name).expect("Table mapping was invalid");
    let json_data = std::fs::read_to_string(file_path)?;
    let raw_json: serde_json::Value = serde_json::from_str(&json_data)?;

    if let Some(items) = raw_json.get("Items").and_then(|v| v.as_array()) {
        for item_value in items {
            let mut item_map = HashMap::new();
            if let Some(obj) = item_value.as_object() {
                for (key, val) in obj {
                    item_map.insert(key.clone(), json_to_attribute_value(val));
                }
            }
            client.put_item()
                .table_name(table_name)
                .set_item(Some(item_map))
                .send()
                .await?;
        }
    }

    println!("✅ Successfully seeded items to local DynamoDB");
    Ok(())
}

fn get_tables_as_string(tables: HashMap<String, String>) -> String {
    return tables.keys()
    .cloned()
    .collect::<Vec<String>>()
    .join(", ");
}

fn json_to_attribute_value(val: &serde_json::Value) -> AttributeValue {
    if let Some(obj) = val.as_object() {
        if let Some(s) = obj.get("S").and_then(|v| v.as_str()) {
            return AttributeValue::S(s.to_string());
        }
        if let Some(n) = obj.get("N").and_then(|v| v.as_str()) {
            return AttributeValue::N(n.to_string());
        }
    }
    AttributeValue::Null(true)
}