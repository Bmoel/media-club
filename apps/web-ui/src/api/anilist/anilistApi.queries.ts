export const MediaInfoQuery = `
query MediaInfoQuery($idIn: [Int], $sort: [MediaSort]) {
  Page {
    media(id_in: $idIn, sort: $sort) {
      id,
      idMal,
      title {
        english,
        native,
      },
      coverImage {
        extraLarge
      },
      bannerImage,
      averageScore,
      siteUrl,
      studios {
        nodes {
          name
        }
      },
      startDate {
        month
        year
        day
      }
    }
  }
}
`;

export const MediaListWithUsersQuery = `
query MediaList($userIdIn: [Int], $mediaId: Int, $format: ScoreFormat) {
  Page {
    mediaList(userId_in: $userIdIn, mediaId: $mediaId) {
      score(format: $format)
      user {
        avatar {
          medium
        }
        bannerImage
        name
        siteUrl
        id
      }
    }
  }
}
`;