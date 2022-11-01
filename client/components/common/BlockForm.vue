<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
  <form @submit.prevent="submit">
    <h3>{{ title }}</h3>
    <article
      v-if="fields.length"
    >
      <div
        v-for="field in fields"
        :key="field.id"
      >
      <div v-if="field.id === 'content'">
        <label :for="field.id" style="display: block;">{{ field.label }}:</label>
        <textarea
          style="width: 100%"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
        />
      </div>

        <!-- Type Containter -->
        <div v-else-if="field.id ==='typeFreet'">
          <ul>
            <li v-for="freetType in field.allFreetTypes">
              <input type="radio" name="typeFreet"
                v-model="typeFreet"
                :value="freetType"
                :id="freetType"
                @input="field.value = $event.target.value"
              >
              <label :for="freetType" class="radio-label">
                <img class="`fleet-icons" :src="`images/${freetType}.png`" alt="">
              </label>
            </li>
          </ul>
        </div> 
        
        <div v-else-if="field.id ==='listingName'" v-show="typeFreet == 'merchant'">
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
        <div v-else-if="field.id ==='expirationDate'" v-show="typeFreet == 'merchant' || typeFreet == 'fleeting'">
          <label :for="field.id">{{ field.label }}:</label>
          <input type="date" 
          :id="field.id" 
          :name="field.id"
          @input="field.value = $event.target.value">
        </div>

        <input
          v-else
          :type="field.id === 'password' ? 'password' : 'text'"
          :name="field.id"
          :value="field.value"
          @input="field.value = $event.target.value"
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
      typeFreet:'', // freetType
      url: '', // Url to submit form to
      method: 'GET', // Form request method
      hasBody: false, // Whether or not form request has a body
      setUsername: false, // Whether or not stored username should be updated after form submission
      refreshFreets: false, // Whether or not stored freets should be updated after form submission
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

        if (this.callback) {
          this.callback();
        }
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>
form {
  border: 1px solid #111;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 14px;
  position: relative;
}

article > div {
  display: flex;
  flex-direction: column;
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
}

ul {
    list-style: none;
}
li {
    display: inline-block;
    margin-right: 15px;
}
input[type="radio"]  {
    visibility:hidden;
}
.radio-label {
    cursor: pointer;
    border-radius: 100px;
}

input[type="radio"]:checked + label {
    background: #882DFF;
}

.radio-label:hover {
  background: #E6D2FF;
}

.radio-label img {
  transform: translateY(6px);
  width: 24px;
  height: auto;
}

</style>
