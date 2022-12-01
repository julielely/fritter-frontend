<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <article
    class="merchant"
  >
  <div>
    <!-- <p>{{ merchantFreet.listingStatus == 'forsale' ? 'For Sale' : 'Sold' }}</p> -->
    <p><span v-if="merchantFreet.listingStatus == 'forsale' && $store.state.username == freet.author"><button id="merchant-button">For Sale</button></span>
      <span v-if="merchantFreet.listingStatus == 'sold' && $store.state.username == freet.author"><button id="sold-merchant-button">Sold</button></span>
      ${{merchantFreet.listingPrice}} • {{merchantFreet.paymentType}} @ {{merchantFreet.paymentUsername}} • {{merchantFreet.listingLocation}}</p>
    <p>{{merchantFreet.listingName}}</p>
    <div v-if="merchantFreet.listingStatus == 'forsale' && $store.state.username == freet.author">
    </div>
    <div v-else-if="merchantFreet.listingStatus == 'forsale'">
      <button
      @click="buyMerchantFreet"
      >Buy Now</button>
    </div>
    <div v-else>
      <button v-if="$store.state.username != freet.author" id="sold-button">Sold</button>
    </div>
    <div class="expires">
      <img src="images/fleeting.png" alt="">
      <p>Expires {{freet.expiration}}</p>
    </div>
  </div>

  </article>
</template>

<script>
export default {
  name: 'MerchantComponent',
  props: {
    // Data from the stored freet
    freet: {
      type: Object,
      required: true
    },
    merchantFreet: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editing: false, // Whether or not this freet is in edit mode
      draft: this.freet.content, // Potentially-new content for this freet
      alerts: {} // Displays success/error messages encountered during freet modification
    };
  },
  methods: {
    startEditing() {
      /**
       * Enables edit mode on this freet.
       */
      this.editing = true; // Keeps track of if a freet is being edited
      this.draft = this.freet.content; // The content of our current "draft" while being edited
    },
    stopEditing() {
      /**
       * Disables edit mode on this freet.
       */
      this.editing = false;
      this.draft = this.freet.content;
    },
    deleteFreet() {
      /**
       * Deletes this freet.
       */
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted freet!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    submitEdit() {
      /**
       * Updates freet to have the submitted draft content.
       */
      if (this.freet.content === this.draft) {
        const error = 'Error: Edited freet content should be different than current freet content.';
        this.$set(this.alerts, error, 'error'); // Set an alert to be the error text, timeout of 3000 ms
        setTimeout(() => this.$delete(this.alerts, error), 3000);
        return;
      }

      const params = {
        method: 'PATCH',
        message: 'Successfully edited freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
        }
      };
      this.request(params);
    },
    buyMerchantFreet() {
      /**
       * Updates freet to have the submitted draft content.
       */

      const params = {
        method: 'PATCH',
        message: 'Successfully purchased merchant freet!',
        body: JSON.stringify({content: this.draft}),
        callback: () => {
          this.$set(this.alerts, params.message, 'success');
          setTimeout(() => this.$delete(this.alerts, params.message), 3000);
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
        const r = await fetch(`/api/freets/merchantFreets/purchase/${this.freet._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.editing = false;
        this.$store.commit('refreshFreets');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Roboto:wght@400;500&display=swap');
body {
  font-family: 'Manrope', sans-serif;
}

p {
  /* //styleName: Body/Regular/3; */
  font-family: Manrope;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  letter-spacing: 0em;
  text-align: left;
}

button {
  font-family: 'Manrope';
}
.merchant {
    padding: 20px;
    position: relative;
    background: #F2F2F2;
    border-radius: 12px;
}

.merchant button {
  background: #074952;
  color: white;
  height: 44px;
  width: auto;
  border-radius: 8px;
  padding: 8px 16px 8px 16px;
  border: none;

  font-size: 18px;
  font-weight: 500;
  line-height: 28px;

  transition: background-color 0.2s ease;
  transition: .2s ease-out;
  cursor: pointer;
}

.merchant button:hover {
  background: #186670;
}

.merchant p {
  margin: 0px 0px 12px 0px;
}

#merchant-button, #sold-merchant-button {
  height: auto;
  width: auto;
  border-radius: 8px;
  padding: 6px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  line-height: 18px;
  margin-right: 8px;
  

  background: #07495233;
  color: #074952;
  cursor: auto;
}

#sold-button, #sold-merchant-button{
  background: #D5D5DE !important;
  color: #69696B !important;
  cursor: auto;
}

#sold-button:hover, #sold-merchant-button:hover {
  background: #D5D5DE !important;
}

#merchant-button:hover {
  background: #07495233;
}

.expires {
  display: flex;
  gap: 8px;
  align-items: center;
  align-content: center;
  margin-top: 8px;
}
.expires p {
  font-family: 'Manrope';
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  letter-spacing: 0em;
  text-align: left;

  color: #69696B;
  margin: 0px
}

.expires img {
  height: 16px;
  width: 16px;
}

.alerts * {
  width: 100% !important;
  color: #074952 !important;
  background: #CCF1DC !important;
  margin-top: 8px;
}
</style>
