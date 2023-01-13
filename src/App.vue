<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="list-none flex justify-center mt-2">
        <li class="mx-2">
          <RouterLink to="/">Home</RouterLink>
        </li>
        <li class="mx-2">
          <RouterLink to="/login">Login</RouterLink>
        </li>
      </nav>
    </div>
  </header>
  <RouterView />
</template>
