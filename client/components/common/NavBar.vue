<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="left">
      <!-- <img src="../../public/logo.svg"> -->
      <router-link to="/" class="title">
        Fritter.
      </router-link>
      <!-- <h1 class="title">
        Fritter.
      </h1> -->
    </div>
    <!-- <div class="right">
      <router-link to="/">
        Home
      </router-link>
      <router-link
        v-if="$store.state.username"
        to="/account"
      >
        Account
      </router-link>
      <router-link
        v-else
        to="/login"
      >
        Login
      </router-link>
    </div> -->
    <!-- <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section> -->
  </nav>
</template>

<style scoped>
nav {
    padding: 1vw 2vw;
    background: rgb(22,39,47);
    background: linear-gradient(90deg, rgba(22,39,47,1) 0%, rgba(41,105,122,1) 49%, rgba(209,198,248,1) 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    /* position: relative; */

    position: fixed;
    width: 100%;
    z-index: 100;
}

a:visited { 
 text-decoration: none; 
 color: white; 
}

a {
  text-decoration: none; 
}

.title {
    margin: 0 5px;
    
    font-family: Manrope;
    font-size: 38px;
    font-weight: 700;
    line-height: 27px;
    letter-spacing: 0em;
    text-align: left;
}

img {
    height: 32px;
}

.left {
	display: flex;
	align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
}

.alerts {
    width: 25%;
}
</style>
