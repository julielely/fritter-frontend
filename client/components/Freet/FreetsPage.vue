<!-- Default page that also displays freets -->

<template>
  <main>
    <!-- <div class="dark-overlay"></div> -->
    <div class="main-container">
       <SideNav></SideNav>
        <!-- <div class="nav-bar">
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
            <router-link to="/">
              Archived
            </router-link>
          </div>
        </div> -->

      <div class="freet-content">
        <section v-if="$store.state.username">
        <header>
          <h2>Welcome  <span id="username"> @{{ $store.state.username }}</span></h2>
        </header>
        <CreateFreetForm />
        </section>

        <section v-else>
          <header>
            <h2>Welcome to Fritter!</h2>
          </header>
          <article>
            <h3>
              <router-link to="/login">
                Sign in
              </router-link>
              to create, edit, and delete freets.
            </h3>
          </article>
        </section>

        <section>
          <header>
            <div class="left">
              <h2>
                Viewing all freets
                <span v-if="$store.state.filter">
                  by @{{ $store.state.filter }}
                </span>
              </h2>
            </div>
            <div class="right">
              <GetFreetsForm
                ref="getFreetsForm"
                value="author"
                placeholder="🔍  Filter by author (optional)"
                button="🔄 Get freets"
              />
            </div>
          </header>
          <section
            v-if="$store.state.freets.length"
          >
            <FreetComponent
              v-for="freet in $store.state.freets"
              :key="freet.id"
              :freet="freet"
            />
          </section>
          <article
            v-else
          >
            <h3>No freets found.</h3>
          </article>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import CreateFreetForm from '@/components/Freet/CreateFreetForm.vue';
import GetFreetsForm from '@/components/Freet/GetFreetsForm.vue';
import SideNav from '@/components/common/SideNav.vue';

export default {
  name: 'FreetPage',
  components: {FreetComponent, GetFreetsForm, CreateFreetForm, SideNav},
  mounted() {
    this.$refs.getFreetsForm.submit();
  }
};
</script>

<style scoped>

main {
  padding: 0px;
}

main .main-container{
  display: flex;
  padding: 0 5em 5em;
  margin-top: 70px;

  padding-bottom: 0px;
  height: 100vh;
}

h2 {
  font-size: 28px;
  font-weight: 700;
  line-height: 28px;
}
.freet-content {
  width: 100%;
}
.nav-bar {
  width: 275px;
  border-right: 1px solid #D5D5DE;
  margin-right: 56px;
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

section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}

.search input{
  border: 2px solid #E1E1E6;
}

.dark-overlay {
  background: #00000026;
  width: 100%;
  height: 100%;
  position: fixed;
  margin-top: 0px;
  z-index: 2000;
  top: 0px;
}

#username {
  color: #29697A;
  padding-left: 8px;
}

h2 {
  cursor: default;
}
</style>
