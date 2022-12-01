<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article>
    <!-- <p>{{ merchantFreet.listingStatus == 'forsale' ? 'For Sale' : 'remove' }}</p> -->
    <div class="paymentInfo">
      <h2>{{fritterPay.paymentType}}</h2>
      <p>@{{fritterPay.paymentUsername}}</p>
    </div>
    <div class="buttons">
      
      <button        
      v-if="fritterPay.paymentLink != ''"
      @click="openLink"
      >Link</button>

      <button 
      id="remove-button"
      @click="deleteFritterPay(); refreshFritterPay();">Remove</button>
    </div>
    
  </article>
</template>

<script>
export default {
  name: 'FritterPayComponent',
  props: {
    // Data from the stored freet
    fritterPay: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {}, // Displays success/error messages encountered during freet modification
      paymentLink: this.fritterPay.paymentLink
    };
  },
  methods: {
    openLink(){
      const link = this.fritterPay.paymentLink;
      window.open(link, "_blank");
    },
    refreshFritterPay() {
      this.$store.commit('refreshFritterPay');
    },
    deleteFritterPay() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('refreshFritterPay');
          this.$store.commit('alert', {
            message: 'Successfully deleted FritterPay information!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/fritterPay/${this.fritterPay._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        // this.$store.commit('refreshFritterPay');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Roboto:wght@400;500&display=swap');
body {
  font-family: 'Manrope', sans-serif;
}

article {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  width: 50%;
  padding: 12px;
  background: #F2F2F2;
  border-radius: 8px;
}

h2 {
  font-family: 'Manrope';
  font-size: 18px;
  font-weight: 800;
  line-height: 30px;
  letter-spacing: 0em;
  text-align: left;
  margin: 0px;
}

p {
  /* //styleName: Body/Regular/3; */
  font-family: Manrope;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  letter-spacing: 0em;
  text-align: left;
  margin: 0px;
}
.paymentInfo {
  display: flex;
  flex-direction: column;
}
button, .linkButton {
  font-family: 'Manrope';
  background: #074952;
  color: white;
  height: 44px;
  width: auto;
  border-radius: 8px;
  padding: 8px 16px 8px 16px;
  margin-right: 8px;
  border: none;

  font-size: 18px;
  font-weight: 500;
  line-height: 28px;

  transition: background-color 0.2s ease;
  transition: .2s ease-out;
  cursor: pointer;
}

button:hover, .linkButton:hover {
  background: #186670;
}


#remove-button {
  background: #D5D5DE;
  color: #111111;
  cursor: auto;
}

#remove-button:hover {
  background: #ABABB5;
}


</style>
