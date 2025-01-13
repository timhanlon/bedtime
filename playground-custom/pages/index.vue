<template>
  <div class="container">
    <h1>Bedtime Playground</h1>
    <p>Welcome to the Bedtime playground! This demo includes:</p>
    <ul>
      <li>
        <NuxtLink to="/stories">Default story viewer</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/custom">Custom story viewer</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

ul {
  margin-top: 1rem;
}

a {
  color: #00dc82;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
