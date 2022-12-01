<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form ref="thisForm" @submit.prevent="submit">
    <h3 v-if="title != 'Create a freet'">{{ title }}</h3>
    <article
      v-if="fields.length"
    >
      <div
        v-for="field in fields"
        :key="field.id"
      >
      <div v-if="field.id === 'content'">
        <!-- <label :for="field.id" style="display: block;">{{ field.label }}:</label> -->
        <textarea
          maxlength="140"
          style="width: 100%"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
          placeholder="What's on your mind?"
        />
      </div>

        <!-- Type Containter -->
        <div v-else-if="field.id ==='typeFreet'">
          <ul style="padding: 0px; margin: 0px 0px 12px 0px;">
            <li v-for="freetType in field.allFreetTypes">
              <input type="radio" name="typeFreet"
                v-model="typeFreet"
                :value="freetType"
                :id="freetType"
                :checked="freetType === 'default'"
                @input="field.value = $event.target.value"
              >
              <label :for="freetType" class="radio-label">
                <img class="`fleet-icons" :src="`images/${freetType}.png`">
              </label>
            </li>
          </ul>
        </div> 

        
        <div v-else-if="field.id ==='listingName'" v-show="typeFreet == 'merchant'">
          <div class="merchant-modal">
            <h2>Merchant Freet</h2>
            <p>Freets that facilitate selling items or services.</p>
          </div>
          <label :for="field.id">{{ field.label }}:</label>
          <input 
            :id="field.id" 
            :name="field.id"
            @input="field.value = $event.target.value">
        </div>

        <div v-else-if="field.id ==='listingPrice'" v-show="typeFreet == 'merchant'">
          <label :for="field.id">{{ field.label }}:</label>
          <input 
            :id="field.id" 
            :name="field.id"
            @input="field.value = $event.target.value"
            >
        </div>

        <div v-else-if="field.id ==='listingLocation'" v-show="typeFreet == 'merchant'">
          <label :for="field.id">{{ field.label }}:</label>
          <input :id="field.id" 
          :name="field.id"
          @input="field.value = $event.target.value"
          >
        </div>

        <div v-else-if="field.id ==='expiration'" v-show="typeFreet == 'merchant' || typeFreet == 'fleeting'">
          <div v-if="typeFreet == 'merchant'" class="merchant-modal">
            <label :for="field.id">{{ field.label }}:</label>
            <input type="datetime-local" 
            :id="field.id" 
            :name="field.id"
            @input="field.value = $event.target.value">
          </div>
          
          <div v-if="typeFreet == 'fleeting'">
            <div class="dark-overlay"></div>
            <div class="fleeting-modal">
              <h2>Fleeting Freet</h2>
              <p>Freets that are automatically deleted at the set date and time.</p>
              <label :for="field.id">{{ field.label }}:</label>
              <input type="datetime-local" 
              :id="field.id" 
              :name="field.id"
              @input="field.value = $event.target.value">
            </div>
          </div>
        </div>

        <!-- <div v-else-if="field.id ==='paymentType'">
          <select id="paymentType" name="paymentType">
            <option v-for="payment in field.paymentTypes" 
            value="payment">{{payment}}</option>
          </select>
        </div> -->

        <input
          v-else
          :type="field.id === 'password' ? 'password' : 'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
          :placeholder="field.id"
          style="margin-bottom: 8px;"
        >
      </div>
    </article>
    <article v-else>
      <p>{{ content }}</p>
    </article>
    <button
      type="submit"
    >
      {{ title }}
    </button>
    <section class="alerts">
      <article
        v-for="(status, alert, index) in alerts"
        :key="index"
        :class="status"
      >
        <p>{{ alert }}</p>
      </article>
    </section>
  </form>
</template>

<script>

export default {
  name: 'BlockForm',
  data() {
    /**
     * Options for submitting this form.
     */
    return {
      typeFreet: 'default', // freetType
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshFreets: false, // Whether or not stored freets should be updated after form submission
      refreshFritterPay: false, // Whether or not stored freets should be updated after form submission
      alerts: {}, // Displays success/error messages encountered during form submission
      callback: null // Function to run after successful form submission
    };
  },
  methods: {
    async submit() {
      /**
        * Submits a form with the specified options from data().
        */
      const options = {
        method: this.method,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin' // Sends express-session credentials with request
      };
      if (this.hasBody) {
        options.body = JSON.stringify(Object.fromEntries(
          this.fields.map(field => {
            const {id, value} = field;
            field.value = '';
            return [id, value];
          })
        ));
      }

      try {
        const r = await fetch(this.url, options);
        if (!r.ok) {
          // If response is not okay, we throw an error and enter the catch block
          const res = await r.json();
          throw new Error(res.error);
        }

        if (this.setUsername) {
          const text = await r.text();
          const res = text ? JSON.parse(text) : {user: null};
          this.$store.commit('setUsername', res.user ? res.user.username : null);
        }

        if (this.refreshFreets) {
          this.$store.commit('refreshFreets');
        }

        if (this.refreshFritterPay) {
          this.$store.commit('refreshFritterPay');
        }

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }

      this.$refs.thisForm.reset(); 
      this.typeFreet = 'default';
    }
    }
};
</script>

<style scoped>

form {
  /* border: 1px solid #111; */
  /* padding: 0.5rem; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
  font-family: 'Manrope';
}

article > div {
  display: flex;
  flex-direction: column;
  /* padding-bottom: 8px; */
}

form > article p {
  margin: 0;
}

form h3,
form > * {
  margin: 0.3em 0;
}

form h3 {
  margin-top: 0;
}

textarea {
  font-family: inherit;
  font-size: inherit;

  border: 2px solid #E1E1E6;
  width: 100%;
  border-radius: 12px;
  height: 124px;
  padding: 12px;
  margin-top: 16px;

  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0em;
}

ul {
    list-style: none;
}
li {
    display: inline-block;
    margin-right: 15px;
}

input, select {
  border: 2px solid #E1E1E6;
  border-radius: 8px;
  /* padding: 8px, 12px, 8px, 12px; */
  height: 40px;
  width: 100%;
  font-family: 'Manrope';
  padding-left: 8px;
  padding-right: 8px;
}

input[type="radio"]  {
    visibility:hidden;
    width: 0px;
    height: 0px;
}
.radio-label {
    cursor: pointer;
    border-radius: 100px;
    padding: 6px;

    align-items: center;
    display: flex;
    height: 38px;
    width: 38px;
}

label {
  padding: 8px 0px 8px 0px;
}

input[type="radio"]:checked + label {
    background: #0B758440;
}

.radio-label:hover {
  background: #F2F2F2;
}

.radio-label img {
  /* transform: translateY(6px); */
  width: 24px;
  height: auto;
}

button {
  background: #074952;
  color: white;
  height: 44px;
  width: auto;
  border-radius: 8px;
  padding: 8px 16px 8px 16px;
  border: none;

  font-family: 'Manrope';
  font-size: 18px;
  font-weight: 500;
  line-height: 28px;

  transition: background 0.2s ease;
  transition: .2s ease-out;
}

button:hover {
  background: #186670;
}

/* .fleeting-modal {
  padding: 32px;
} */

.fleeting-modal, .merchant-modal {
  border-top: 0.5px solid #D5D5DE;
}

.fleeting-modal p, .merchant-modal p {
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  color: #69696B;
  padding-bottom: 6px;
}

.fleeting-modal h2, .merchant-modal h2 {
  font-size: 24px;
  font-weight: 700;
  line-height: 26px;
  text-align: left;
  padding-bottom: 4px;
  margin-bottom: 0px;
}

label {
  font-family: Manrope;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
  color: #69696B;

  display: block;

}


</style>
