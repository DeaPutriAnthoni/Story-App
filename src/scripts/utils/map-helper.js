const MapHelper = {
  // Map story data for display
  mapStoryToCard(story) {
    return {
      id: story.id,
      title: story.name || story.title,
      description: story.description,
      photoUrl: story.photoUrl,
      createdAt: story.createdAt,
      lat: story.lat,
      lon: story.lon,
    };
  },

  // Map array of stories
  mapStoriesToCards(stories) {
    return stories.map(story => this.mapStoryToCard(story));
  },

  // Map user data
  mapUserData(user) {
    return {
      id: user.userId || user.id,
      name: user.name,
      token: user.token,
    };
  },

  // Map API response to standardized format
  mapApiResponse(response) {
    return {
      error: response.error || false,
      message: response.message || '',
      data: response.listStory || response.data || null,
    };
  },

  // Map favorite stories for local storage
  mapFavoriteStory(story) {
    return {
      id: story.id,
      name: story.name || story.title,
      description: story.description,
      photoUrl: story.photoUrl,
      createdAt: story.createdAt,
      isFavorite: true,
    };
  },

  // Extract coordinates for mapping
  extractCoordinates(story) {
    return {
      lat: parseFloat(story.lat) || 0,
      lon: parseFloat(story.lon) || 0,
      hasLocation: !!(story.lat && story.lon),
    };
  },
};

export default MapHelper;