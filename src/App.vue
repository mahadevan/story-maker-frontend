<script setup lang="ts">
// Remove the default HelloWorld import
// import HelloWorld from './components/HelloWorld.vue'
import TreatmentGenerator from './components/TreatmentGenerator.vue'; // Import our new component
</script>

<template>
  <!-- Remove the default Vite/Vue logos and HelloWorld component -->
  <!--
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  -->
  <main>
    <TreatmentGenerator /> <!-- Use our component -->
  </main>
  <footer>
    Created by MD
  </footer>
</template>

<style scoped>
/* Remove the default styles */
/*
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
*/

/* Add some basic global styles if needed, or leave empty */
main {
  padding: 1rem;
  flex: 1; /* Allow main content to grow */
}

footer {
  text-align: center;
  padding: 1rem;
  margin-top: 2rem; /* Add space above footer */
  color: #6c757d; /* Grey color */
  font-size: 0.9rem;
}

/* Optional: Make App.vue use flex to push footer down if content is short */
/* You might need to apply this to a parent div if #app isn't the direct parent */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
