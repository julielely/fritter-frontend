<!-- Form for changing password (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'FritterPayForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/fritterPay',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'paymentType', label: 'Payment Type', paymentTypes: ['Venmo', 'CashApp', 'Zelle'], value: ''},
        {id: 'username', label: 'Username', value: ''},
        {id: 'link', label: 'Link', value: ''}
      ],
      title: 'Add FritterPay',
      refreshFritterPay: true,
      callback: () => {
        const message = 'Successfully added FritterPay!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
