// src/scripts/data/model/HomeModel.js
import {
  getAllStories,
  getToken,
  removeToken,
  getUserName,
  isLoggedIn,
} from "../api.js"; //

class HomeModel {
  /**
   * Fetches stories from the API.
   * @param {number} page
   * @param {number} size
   * @param {number} location
   * @returns {Promise<Array<object>>} - List of stories.
   * @throws {Error} - If fetching fails.
   */
  async fetchStories(page = 1, size = 20, location = 1) {
    //
    console.log("HomeModel: Fetching stories..."); //
    try {
      const stories = await getAllStories(page, size, location); //
      console.log("HomeModel: Stories fetched successfully", stories); //
      return stories; //
    } catch (error) {
      console.error("HomeModel: Failed to fetch stories", error); //
      // Handle specific errors like authentication here or re-throw
      throw error; //
    }
  }

  /**
   * Checks if the user is logged in.
   * @returns {boolean}
   */
  isUserLoggedIn() {
    //
    return isLoggedIn(); //
  }

  /**
   * Gets the logged-in user's name.
   * @returns {string | null}
   */
  getCurrentUserName() {
    //
    return getUserName(); //
  }

  /**
   * Removes authentication token and user data.
   */
  clearUserData() {
    //
    removeToken(); //
  }
}

export default HomeModel;