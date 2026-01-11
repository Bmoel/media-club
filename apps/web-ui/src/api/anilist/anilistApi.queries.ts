export const MediaInfoQuery = `
query MediaInfoQuery($idIn: [Int], $sort: [MediaSort]) {
  Page {
    media(id_in: $idIn, sort: $sort) {
      id
      title {
        english,
        native,
        romaji,
        userPreferred
      }
      coverImage {
        extraLarge
      }
      bannerImage
      averageScore
      siteUrl
      studios {
        nodes {
          name
        }
      }
      startDate {
        month
        year
        day
      }
      type
    }
  }
}
`;

export const MediaListWithUsersQuery = `
query MediaList($idIn: [Int], $mediaId: Int, $format: ScoreFormat) {
  Page {
    mediaList(userId_in: $idIn, mediaId: $mediaId) {
      score(format: $format)
      notes
      user {
        avatar {
          medium
        }
        name
        siteUrl
        id
      }
    }
  }
}
`;

export const UserFavoritesQuery = `
query User($id: Int) {
  User(id: $id) {
    favourites {
      anime {
        nodes {
          id
        }
      }
      characters {
        nodes {
          id
          name {
            full
          }
          image {
            medium
          }
          siteUrl
          media {
            nodes {
              id
            }
          }
        }
      }
    }
  }
}
`;