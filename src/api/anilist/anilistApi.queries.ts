export const MediaInfoQuery = `
query MediaInfoQuery($idIn: [Int], $sort: [MediaSort]) {
  Page {
    media(id_in: $idIn, sort: $sort) {
      id,
      title {
        english,
        native,
      },
      coverImage {
        extraLarge
      }
    }
  }
}
`;