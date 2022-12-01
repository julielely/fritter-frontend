<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
  <nav>
    <div class="nav-bar">
          <div class="nav-bar-options">
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
            <router-link to="/archived" v-if="$store.state.username">
              Archived
            </router-link>
          </div>
        </div>

    <section class="alerts">
      <article
        v-for="(status, alert, index) in $store.state.alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </nav>
</template>

<style scoped>
nav {
  color: #111111;
  /* border-right: 1px solid #D5D5DE; */
  max-width: 275px;
  min-width: 200px;
  margin-right: 56px;
}

.nav-bar {
  border-right: 1px solid #D5D5D5;
  height: 100%;
  position: fixed;
  max-width: 275px;
  min-width: 200px;
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

.nav-bar-options * {
  height: 44px;
  width: auto;
  border-radius: 8px;
  padding: 8px 16px 8px 16px;

  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  text-align: left;
  text-decoration: none;
  color: #111111;
}

.nav-bar-options:first-child, h2 {
  margin-top: 54px;
}

.nav-bar-options {
  position: fixed;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-bar-options * {
  transition: background 0.2s ease;
  transition: .2s ease-out;
}
.nav-bar-options *:hover {
  background: #D2C4FB4D;
}

</style>
