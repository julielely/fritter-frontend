<!-- Page for account settings and management -->
<!-- User should be authenticated in order to see this page -->

<template>
  <main>
    <SideNav></SideNav>
    <div class="main-content">
      <section>
      <header>
        <h2>Account settings for @{{ $store.state.username }}</h2>
      </header>
      <ChangeUsernameForm />
      <ChangePasswordForm />
      <GetFritterPayForm 
                ref="getFritterPayForm"
                value="author"
                placeholder="🔍  Filter by author (optional)"
                button="🔄 Get freets"
                style="display: none;"
        />
      <div class="fritterPayContainer">
        <FritterPayComponent
              v-for="payment in $store.state.fritterPays"
              :key="payment.id"
              :fritterPay="payment"
        />
      </div>
        
      <FritterPayForm />
    </section>
    <section>
      <header>
        <h2>Account management</h2>
      </header>
      <LogoutForm />
      <DeleteAccountForm />
    </section>
    </div>
  </main>
</template>

<script>
import ChangeUsernameForm from '@/components/Account/ChangeUsernameForm.vue';
import ChangePasswordForm from '@/components/Account/ChangePasswordForm.vue';
import DeleteAccountForm from '@/components/Account/DeleteAccountForm.vue';
import LogoutForm from '@/components/Account/LogoutForm.vue';
import SideNav from '@/components/common/SideNav.vue';
import GetFritterPayForm from '@/components/FritterPay/GetFritterPay.vue';
import FritterPayComponent from '@/components/FritterPay/FritterPayComponent.vue';
import FritterPayForm from '@/components/FritterPay/AddFritterPay.vue';

export default {
  name: 'AccountPage',
  components: {
    ChangeUsernameForm,
    ChangePasswordForm,
    FritterPayForm,
    DeleteAccountForm,
    LogoutForm,
    SideNav,
    GetFritterPayForm,
    FritterPayComponent
  },
  mounted() {
    this.$refs.getFritterPayForm.submit();
  }
};
</script>

<style scoped>
main {
  margin-top: 70px;
  display: flex;
}

main div {
  margin-top: 24px;
}

.fritterPayContainer {
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
}
</style>
