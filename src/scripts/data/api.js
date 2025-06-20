import CONFIG from "../config";

const API_ENDPOINT = {
  STORIES: `${CONFIG.BASE_URL}/stories`,
  STORIES_GUEST: `${CONFIG.BASE_URL}/stories/guest`,
  DETAIL_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function removeToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("user");
}

function getUserName() {
  return localStorage.getItem("userName");
}

function isLoggedIn() {
  return getToken() !== null;
}

async function login({ email, password }) {
  try {
    const response = await fetch(API_ENDPOINT.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(responseJson.message || "Login failed");
    }

    if (responseJson.loginResult && responseJson.loginResult.token) {
      setToken(responseJson.loginResult.token);
      if (responseJson.loginResult.name) {
        localStorage.setItem("userName", responseJson.loginResult.name);
      }
    }

    return responseJson;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

async function register({ name, email, password }) {
  try {
    const response = await fetch(API_ENDPOINT.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
      if (responseJson && responseJson.message) {
        throw new Error(responseJson.message);
      }
      throw new Error(`Registration failed with status: ${response.status}`);
    }

    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
}

async function getAllStories(page = 1, size = 10, location = 0) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Anda perlu login untuk melihat cerita.");
    }

    const response = await fetch(
      `${API_ENDPOINT.STORIES}?page=${page}&size=${size}&location=${location}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        removeToken();
        throw new Error(
          "Sesi Anda telah habis atau tidak valid. Silakan login kembali."
        );
      }
      if (errorData && errorData.message) {
        throw new Error(errorData.message);
      }
      throw new Error(`Error ${response.status}: Failed to fetch stories`);
    }

    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }
    return responseJson.listStory;
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
}

async function addNewStoryGuest(formData) {
  try {
    const response = await fetch(API_ENDPOINT.STORIES_GUEST, {
      method: "POST",
      body: formData,
    });

    const responseJson = await response.json();

    if (!response.ok) {
      if (responseJson && responseJson.message) {
        throw new Error(responseJson.message);
      }
      throw new Error(`Error ${response.status}: Failed to add story (guest)`);
    }

    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  } catch (error) {
    console.error("Error adding new story (guest):", error);
    throw error;
  }
}

async function addNewStoryAuthenticated(formData) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error(
        "Anda perlu login untuk menambahkan cerita terautentikasi."
      );
    }

    const response = await fetch(API_ENDPOINT.STORIES, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseJson = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        removeToken();
        throw new Error(
          "Sesi Anda telah habis atau tidak valid. Silakan login kembali."
        );
      }
      if (responseJson && responseJson.message) {
        throw new Error(responseJson.message);
      }
      throw new Error(
        `Failed to add story (authenticated) with status: ${response.status}`
      );
    }

    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  } catch (error) {
    console.error("Error adding new story (authenticated):", error);
    throw error;
  }
}

async function getStoryDetail(id) {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("Anda perlu login untuk melihat detail cerita.");
    }

    const response = await fetch(API_ENDPOINT.DETAIL_STORY(id), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        removeToken();
        throw new Error(
          "Sesi Anda telah habis atau tidak valid. Silakan login kembali."
        );
      }
      if (errorData && errorData.message) {
        throw new Error(errorData.message);
      }
      throw new Error(`Error ${response.status}: Failed to fetch story detail`);
    }

    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }
    return responseJson.story;
  } catch (error) {
    console.error(`Error fetching story detail with id ${id}:`, error);
    throw error;
  }
}

function logout() {
  removeToken();
  alert("Logout berhasil!");
  window.location.hash = "/login";
  window.location.reload();
}

// TAMBAHKAN DUA FUNGSI BARU DI BAWAH INI
export async function subscribePushNotification({
  endpoint,
  keys: { p256dh, auth },
}) {
  const accessToken = getToken();
  if (!accessToken) {
    throw new Error("Anda harus login untuk berlangganan notifikasi.");
  }
  const data = JSON.stringify({ endpoint, keys: { p256dh, auth } });

  const fetchResponse = await fetch(API_ENDPOINT.SUBSCRIBE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: data,
  });

  const json = await fetchResponse.json();
  return { ...json, ok: fetchResponse.ok };
}

export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = getToken();
  if (!accessToken) {
    throw new Error("Anda harus login untuk berhenti berlangganan.");
  }
  const data = JSON.stringify({ endpoint });

  const fetchResponse = await fetch(API_ENDPOINT.UNSUBSCRIBE, {
    // Method untuk unsubscribe seharusnya DELETE, sesuai studi kasus
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: data,
  });

  const json = await fetchResponse.json();
  return { ...json, ok: fetchResponse.ok };
}

export {
  getAllStories,
  addNewStoryGuest,
  login,
  register,
  getToken,
  removeToken,
  getUserName,
  isLoggedIn,
  logout,
  addNewStoryAuthenticated,
  getStoryDetail,
};