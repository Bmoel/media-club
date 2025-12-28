use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};

#[derive(Debug, Display, EnumString, Serialize, Deserialize)]
#[strum(serialize_all = "snake_case")]
pub enum MediaStatus {
    #[strum(serialize = "completed")]
    Completed,
    #[strum(serialize = "watching")]
    Watching,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MediaItem {
    pub id: i64,
    pub date_started: String,
    pub date_finished: String,
    pub status: MediaStatus,
}

#[async_trait]
pub trait MediaRepository: Send + Sync {
    async fn get_media_entries(&self) -> Result<Vec<MediaItem>, String>;
}
