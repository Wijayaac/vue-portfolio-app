<script>
import { API_URL } from "../../utils/constant";
import axios from "axios";

export default {
  data() {
    return {
      errors: [],
      username: "",
      password: "",
    };
  },
  methods: {
    isValidForm() {
      this.errors = [];

      if (!this.username) {
        this.errors.push("Username must be filled");
      }

      if (!this.password) {
        this.errors.push("Password must be filled");
      }
      return !this.errors.length > 0;
    },
    async handleLogin() {
      const isValidForm = this.isValidForm();
      if (!isValidForm) {
        return;
      }
      try {
        const { data } = await axios.post(
          `${API_URL}/login`,
          {
            username: this.username,
            password: this.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<template>
  <div class="h-screen flex justify-center items-center">
    <div class="mt-10 sm:mt-0 max-w-[600px] mx-auto">
      <div class="w-full">
        <div class="w-full">
          <div class="px-4 sm:px-0">
            <h1 class="text-lg text-center font-medium leading-6 text-gray-900">
              Login
            </h1>
          </div>
        </div>
        <div class="mt-5 w-full md:mt-0">
          <form @submit.prevent="handleLogin">
            <div class="overflow-hidden shadow sm:rounded-md">
              <div class="bg-white px-4 py-5 sm:p-6">
                <div class="grid grid-cols-6 gap-6">
                  <div class="col-span-12">
                    <label
                      for="username"
                      class="block text-sm font-medium text-gray-700"
                      >Username</label
                    >
                    <input
                      type="text"
                      v-model="username"
                      id="username"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div class="col-span-12">
                    <label
                      for="password"
                      class="block text-sm font-medium text-gray-700"
                      >Password</label
                    >
                    <input
                      type="password"
                      v-model="password"
                      id="password"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <ul class="form-error mt-5" v-if="errors">
                  <li
                    v-for="(error, index) in errors"
                    :key="index"
                    class="text-red-500 text-sm"
                  >
                    {{ error }}
                  </li>
                </ul>
              </div>
              <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <button
                  type="submit"
                  class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
