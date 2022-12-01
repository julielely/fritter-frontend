<!-- Form for getting freets (all, from user) (inline style) -->

<script>
import InlineForm from '@/components/common/InlineForm.vue';

export default {
  name: 'GetFritterPayForm',
  mixins: [InlineForm],
  data() {
    return {username: this.$store.state.username};
  },
  methods: {
    async submit() {
      const url = `/api/fritterPay?author=${this.username}`;
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateFritterPay', res);
        this.$store.commit('refreshFritterPay');
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>