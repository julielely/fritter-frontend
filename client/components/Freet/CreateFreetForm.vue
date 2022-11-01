<!-- Form for creating freets (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateFreetForm',
  mixins: [BlockForm],
  data() {
    return {
      url: '/api/freets',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'typeFreet', label: 'Freet Type', allFreetTypes: ['default', 'merchant', 'fleeting'], value: ''}, // typeFreet
        {id: 'listingName', label: 'Item Title', value:''}, // listingName
        {id: 'listingPrice', label: 'Item Price', value:''}, // listingPrice
        {id: 'listingLocation', label: 'Location', value:''}, // listingLocation
        {id: 'expirationDate', label: 'Expiration', value: new Date()}, // expirationDate
        {id: 'content', label: 'Content', value: ''}
      ],
      title: 'Create a freet',
      refreshFreets: true,
      callback: () => {
        const message = 'Successfully created a freet!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
