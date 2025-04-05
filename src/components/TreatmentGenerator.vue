<template>
  <div class="treatment-generator">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="title-icon">
        <path d="M19 2H5C3.9 2 3 2.9 3 4V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V4C21 2.9 20.1 2 19 2ZM19 20H5V4H7V11L9.5 9.5L12 11V4H19V20Z"/>
    </svg>
    <h2>Plot Treatment Generator</h2>

    <div class="input-section">
      <label for="plot-input">Enter your plot summary:</label>
      <textarea id="plot-input" v-model="plotInput" rows="10" placeholder="Paste or type your plot summary here..."></textarea>
    </div>

    <div class="button-group">
      <button @click="generateTreatment" :disabled="isLoading">
        {{ isLoading ? 'Creating...' : 'Create Story' }}
      </button>
      <button @click="clearFields" class="clear-button" :disabled="isLoading">Clear</button>
    </div>

    <div v-if="isLoading" class="loading-indicator">
      Creating Story...
    </div>

    <div v-if="errorMessage" class="error-message">
      Error: {{ errorMessage }}
    </div>

    <div v-if="generatedTreatment" class="output-section">
      <h3>Generated Treatment:</h3>
      <pre>{{ generatedTreatment }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const plotInput = ref('');
const generatedTreatment = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

// Access the environment variable for the API base URL
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const generateTreatmentEndpoint = `${apiBaseUrl}/generate-treatment`;

const generateTreatment = async () => {
  // Clear previous results and errors
  generatedTreatment.value = '';
  errorMessage.value = '';
  isLoading.value = true;

  // Basic validation
  if (!plotInput.value.trim()) {
    errorMessage.value = 'Plot summary cannot be empty.';
    isLoading.value = false;
    return;
  }

  try {
    // Use the environment variable in the fetch call
    const response = await fetch(generateTreatmentEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plot: plotInput.value })
    });

    if (!response.ok) {
      // Try to get error message from backend if available
      let errorMsg = `HTTP error! status: ${response.status}`;
      try {
          const errorData = await response.json();
          errorMsg = errorData.detail || errorMsg; // FastAPI often uses 'detail' for errors
      } catch (e) {
          // Ignore if response is not JSON or other parsing error
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    generatedTreatment.value = data.treatment;

    // Remove the placeholder simulation
    // await new Promise(resolve => setTimeout(resolve, 1500));
    // generatedTreatment.value = `This is a placeholder treatment generated for the plot:
    // "${plotInput.value}"
    // \nReplace this with the actual API call result. It should be about 250 words, detailing key scenes, character arcs, and turning points based on the input summary.`;

  } catch (error) {
    console.error('Error generating treatment:', error);
    if (error instanceof Error) {
      errorMessage.value = `Failed to generate treatment: ${error.message}`;
    } else {
      errorMessage.value = 'An unknown error occurred.';
    }
  } finally {
    isLoading.value = false;
  }
};

const clearFields = () => {
  plotInput.value = '';
  generatedTreatment.value = '';
  errorMessage.value = '';
};
</script>

<style scoped>
.treatment-generator {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  font-family: sans-serif;
}

.title-icon {
    display: block;
    width: 48px;
    height: 48px;
    margin: 0 auto 1rem;
    fill: #007bff;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

.input-section {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  resize: vertical;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

button {
  flex: 1;
  padding: 0.8rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clear-button {
  background-color: #6c757d;
}

.clear-button:hover {
  background-color: #5a6268;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading-indicator {
  text-align: center;
  padding: 1rem;
  color: #555;
  font-style: italic;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
}

.output-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
}

.output-section h3 {
  margin-top: 0;
  color: #333;
  margin-bottom: 1rem;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #fff;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.95rem;
  color: #444;
}
</style> 