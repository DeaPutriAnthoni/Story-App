const MapInitiator = {
  /**
   * Inisialisasi peta untuk menampilkan daftar lokasi cerita.
   * @param {string} containerId ID elemen HTML container peta.
   * @param {Array<object>} stories Array objek cerita yang berisi lat dan lon.
   * @returns {object|null} Instance peta Leaflet atau null jika gagal.
   */
  initDisplayMap(containerId, stories) {
    const mapContainer = document.getElementById(containerId);
    if (!mapContainer) {
      console.error(`Map container with id "${containerId}" not found.`);
      return null;
    }

    // Hapus peta lama jika ada
    if (mapContainer._leaflet_id) {
      try {
        if (window.mapInstances && window.mapInstances[containerId]) {
          window.mapInstances[containerId].remove();
          delete window.mapInstances[containerId];
          console.log(`Previous map instance for ${containerId} removed.`);
        }
      } catch (e) {
        console.warn(
          `Could not remove previous map instance for ${containerId}:`,
          e
        );
      }
    }

    try {
      const initialLat = stories.length > 0 ? stories[0].lat : -6.175392; // Contoh: Monas
      const initialLon = stories.length > 0 ? stories[0].lon : 139.212268; // Contoh: Indonesia umum
      const map = L.map(containerId).setView([initialLat, initialLon], 4);

      // Definisikan Base Layers (layer peta dasar)
      const osmLayer = L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      );

      // --- PERBAIKI BAGIAN INI ---
      // Pastikan variabel ini dideklarasikan dengan nama yang valid dan konsisten
      const openTopoMapLayer = L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 17,
          attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        }
      );
      // --- AKHIR BAGIAN PERBAIKAN ---

      // Tambahkan layer default ke peta
      osmLayer.addTo(map);

      // Buat objek untuk Layer Control
      const baseLayers = {
        OpenStreetMap: osmLayer,
        OpenTopoMap: openTopoMapLayer, // <--- Gunakan nama variabel yang sudah dideklarasikan dengan benar di sini
        // Tambahkan layer lain di sini jika ada (pastikan sudah dideklarasikan di atas)
      };

      // Tambahkan Layer Control ke peta
      L.control.layers(baseLayers).addTo(map);

      // Tambahkan marker untuk setiap cerita dengan lokasi
      const markers = [];
      stories.forEach((story) => {
        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon]);
          marker.bindPopup(`
            <strong>${story.name || "Anonim"}</strong><br>
            ${story.description.substring(0, 100)}${
              story.description.length > 100 ? "..." : ""
            }<br>
            <img src="${
              story.photoUrl
            }" alt="Foto cerita" style="width: 80px; height: auto; margin-top: 5px;">
          `);
          markers.push(marker);
          marker.addTo(map);
        }
      });

      // Sesuaikan bounds peta agar mencakup semua marker jika ada
      if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.5));
      }

      setTimeout(() => map.invalidateSize(), 100);

      if (!window.mapInstances) window.mapInstances = {};
      window.mapInstances[containerId] = map;

      console.log(`Display map initialized successfully on ${containerId}`);
      return map;
    } catch (error) {
      console.error(
        `Error creating display map instance on ${containerId}:`,
        error
      );
      if (mapContainer)
        mapContainer.innerHTML =
          '<p style="color: red; text-align: center; padding: 20px;">Gagal memuat peta. Pastikan koneksi internet stabil, Leaflet.js sudah dimuat, dan API Key peta (jika diperlukan) sudah benar.</p>';
      return null;
    }
  },

  /**
   * @param {string} containerId ID elemen HTML container peta picker.
   * @param {function} onLocationSelected 
   * @returns {object|null} 
   */
  initPickerMap(containerId, onLocationSelected) {
    const mapContainer = document.getElementById(containerId);
    if (!mapContainer) {
      console.error(`Picker map container with id "${containerId}" not found.`);
      return null;
    }

    // Hapus peta lama jika ada
    if (mapContainer._leaflet_id) {
      try {
        if (window.mapInstances && window.mapInstances[containerId]) {
          window.mapInstances[containerId].remove();
          delete window.mapInstances[containerId];
          console.log(
            `Previous picker map instance for ${containerId} removed.`
          );
        }
      } catch (e) {
        console.warn(
          `Could not remove previous picker map instance for ${containerId}:`,
          e
        );
      }
    }

    try {
      const map = L.map(containerId).setView([-6.8877, 107.61], 13);
      const osmLayer = L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      );

      // Contoh layer lain (Jika memerlukan API Key, ambil dari STUDENT.txt dan tambahkan di sini)
      const thunderforestLayer = L.tileLayer(
        "https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=YOUR_THUNDERFOREST_API_KEY",
        {
          attribution:
            '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          apikey: "YOUR_THUNDERFOREST_API_KEY",
          maxZoom: 22,
        }
      );

      // Tambahkan layer default ke peta picker
      osmLayer.addTo(map);

      // Buat Layer Control untuk picker
      const baseLayers = {
        OpenStreetMap: osmLayer,
        "Cycle Map (Thunderforest)": thunderforestLayer, // <--- Gunakan nama variabel yang sudah dideklarasikan dengan benar
        // Tambahkan layer lain di sini
      };
      L.control.layers(baseLayers).addTo(map);

      let marker = null;

      map.on("click", function (e) {
        const { lat, lng } = e.latlng;

        if (marker) {
          marker.setLatLng([lat, lng]);
        } else {
          marker = L.marker([lat, lng]).addTo(map);
        }
        marker
          .setPopupContent(
            `Lokasi dipilih: ${lat.toFixed(5)}, ${lng.toFixed(5)}`
          )
          .openPopup();

        if (typeof onLocationSelected === "function") {
          onLocationSelected(lat, lng);
        }
        console.log(`Location clicked: Lat: ${lat}, Lng: ${lng}`);
      });

      setTimeout(() => map.invalidateSize(), 100);

      if (!window.mapInstances) window.mapInstances = {};
      window.mapInstances[containerId] = map;

      console.log(`Picker map initialized successfully on ${containerId}`);
      return map;
    } catch (error) {
      console.error(
        `Error creating picker map instance on ${containerId}:`,
        error
      );
      if (mapContainer)
        mapContainer.innerHTML =
          '<p style="color: red; text-align: center; padding: 20px;">Gagal memuat peta picker. Pastikan koneksi internet stabil, Leaflet.js sudah dimuat, dan API Key peta (jika diperlukan) sudah benar.</p>';
      return null;
    }
  },

  /**
   * Menghapus instance peta dari DOM.
   * @param {string} containerId ID elemen HTML container peta.
   */
  removeMap(containerId) {
    if (window.mapInstances && window.mapInstances[containerId]) {
      try {
        window.mapInstances[containerId].remove();
        delete window.mapInstances[containerId];
        console.log(`Map instance for ${containerId} removed manually.`);
      } catch (e) {
        console.warn(`Could not remove map instance for ${containerId}:`, e);
      }
    }
    const mapContainer = document.getElementById(containerId);
    if (mapContainer) {
      mapContainer.innerHTML = ""; // Bersihkan konten container
    }
  },
};

export default MapInitiator;