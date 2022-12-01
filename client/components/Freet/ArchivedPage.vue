<!-- Default page that also displays freets -->

<template>
  <main>
    <!-- <div class="dark-overlay"></div> -->
    <div class="main-container">
       <SideNav></SideNav>
      <div class="freet-content">
        <section>
          <header>
            <div class="left">
              <h2>
                Archived Freets
              </h2>
            </div>
            <p>Walking down memory lane with your expired Fleeting or Merchant Freets ✨</p>
            <div class="right">
              <GetArchivedForm
                ref="getArchivedForm"
                value="author"
                placeholder="🔍  Filter by author (optional)"
                button="🔄 Get freets"
                style="display: none;"
              />
            </div>
          </header>
          <section
            v-if="$store.state.archivedFreets.length"
          >
            <FreetComponent
              v-for="freet in $store.state.archivedFreets"
              :key="freet.id"
              :freet="freet"
            />
          </section>
          <article
            v-else
          >
            <h3>🫙 You have no archived freets. Get freeting!</h3>
          </article>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
import FreetComponent from '@/components/Freet/FreetComponent.vue';
import GetArchivedForm from '@/components/Freet/GetArchivedForm.vue';
import SideNav from '@/components/common/SideNav.vue';

export default {
  name: 'ArchivedPage',
  components: {FreetComponent, GetArchivedForm, SideNav},
  mounted() {
    this.$refs.getArchivedForm.submit();
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

h3 {
  font-weight: 500;
  color: #69696B;
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
    flex-direction: column;
}

header p {
  margin-top: 0px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  color: #69696B;
}

header h2 {
  margin-bottom: 12px;
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
