<template>
  <div class="treatment-generator">
    <h2>MD's Story Generator</h2>

    <div class="input-section">
      <label for="plot-input">Enter Your Story Idea:</label>
      <textarea id="plot-input" v-model="plotInput" rows="8" placeholder="Describe your concept, characters, or key plot points here..."></textarea>
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
    // Construct the full endpoint URL inside the function
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!apiBaseUrl) {
      // Add a check in case the env variable is missing
      throw new Error("API base URL is not configured.");
    }
    const endpointUrl = `${apiBaseUrl}/generate-treatment`;

    // Use the dynamically constructed endpoint URL in the fetch call
    const response = await fetch(endpointUrl, {
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
  max-width: 700px;
  margin: 3rem auto;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: box-shadow 0.3s ease-in-out;
}

.treatment-generator:hover {
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
}

h2 {
  text-align: center;
  color: #343a40;
  margin-bottom: 2rem;
  font-weight: 600;
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
  padding: 1rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

textarea:focus {
  border-color: #80bdff;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

button {
  flex: 1;
  padding: 0.9rem 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  font-weight: 500;
}

.clear-button {
  background-color: #6c757d;
}

.clear-button:hover {
  background-color: #5a6268;
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

button:active {
    transform: translateY(0px);
}

button:disabled {
  background-color: #adb5bd;
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
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
}

.output-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

.output-section h3 {
  margin-top: 0;
  color: #495057;
  margin-bottom: 1rem;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #fff;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.95rem;
  color: #212529;
  line-height: 1.6;
}
</style> 