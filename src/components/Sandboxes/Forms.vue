<template>
    <div class="container">
        <form v-if="!submitted" @submit="checkForm">
            <div class="row">
                <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
                    <h2>intelliForm</h2>
                  <label for="firstName">
                    <span>Fornavn</span>
                    <input type="text" name="firstName" value="Fornavn" v-model="firstName">
                  </label>
                  <br>
                  <label for="firstName">
                    <span>Etterrnavn</span>
                    <input type="text" name="lastName" value="Etternavn" v-model="lastName">
                  </label>
                  <br>
                  <label for="email">
                    <span>E-post</span>
                    <input type="email" name="email" value="E-post" v-model="emailAddress">
                  </label>
                  <br>
                  <label for="email">
                    <span>Passord</span>
                    <input type="text" name="email" value="Passord" v-model="secretPassword">
                  </label>
                  <br>
                  <app-full-name v-model="fullName"></app-full-name>
                  <label>Lagre data? <br>
                    Ja<input type="radio" id="Ja" value="Ja" v-model="storeData" >
                  </label>
                  <label>
                    Nei<input type="radio" id="Nei" value="Nei" v-model="storeData">
                  </label>
                <br><br>

                 <!-- <input type="submit" value="Send inn data"> -->

                 <button
                            type="submit"
                            @click.prevent="submitted = true"
                            class="btn btn-primary">Submit the Form</button>
                  <!-- <span>Lagre data?</span><br>
                  <label for="one">Ja</label>
                  <input type="radio" id="yes" value="Ja" v-model="picked" >
                  <label for="two">Nei</label>
                  <input type="radio" id="no" value="Nei" v-model="picked">
                  <br> -->

                    <!-- Exercise 1 -->
                    <!-- Create a Signup Form where you retrieve the following Information -->
                    <!-- Full Name (First Name + Last Name) -->
                    <!-- Mail -->
                    <!-- Password -->
                    <!-- Store Data? Yes/No -->

                    <!-- Exercise 2 -->
                    <!-- Only display the Form if it has NOT been submitted -->
                    <!-- Display the Data Summary ONCE the Form HAS been submitted -->

                    <!-- Exercise 3 -->
                    <!-- Edit the Example from above and create a custom "Full Name" Control -->
                    <!-- which still holds the First Name and Last Name Input Field -->
                </div>
            </div>
        </form>

        <p v-if="errors.length">
          <b>Vennligst endre følgende feil:</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>
        <hr>
        <div class="row" v-if="submitted">
            <div class="col-xs-12 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h4>Your Data</h4>
                    </div>
                    <div class="panel-body">
                        <p>Full Name: {{firstName}} {{lastName}} </p>
                        <p>Mail: {{emailAddress}}</p>
                        <p>Password:  {{secretPassword}}</p>
                        <p>Store in Database?:  {{storeData}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

  import FullName from './FullName.vue';

    export default {
      data() {
        return {
          firstName: '',
          lastName: '',
          emailAddress: '',
          secretPassword: '***',
          picked: ['Ja', 'Nei'],
          formSubmitted: false,
          storeData: 'Ja',
          errors: [],
          fullName: 'Ole Aleksander Filli Bom Bom Bom',
          submitted: false
          }
      },
      methods: {
        checkForm: function (e) {
          console.log(e);

          this.errors = [];
           if (this.firstName.length <2) {
             this.errors.push('Fornavn kreves');
           }

           if (this.lastName.length <2) {
             this.errors.push('Etternavn kreves');
           }
           var validEmail = this.validEmail(this.emailAddress);

           if (!validEmail) {
             this.errors.push('E-post ugyldig format');
           }

           if (this.secretPassword.length <5) {
             this.errors.push('Passord må bestå av minst 6 tegn');
           }

           console.log("errors:: " + this.errors.length);

           if(this.errors.length == 0){
             this.formSubmitted = true;
             return true;
           }
           e.preventDefault();
         },
         validEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
          }
      },
      components: {
            appFullName: FullName
        }
    }
</script>

<style>

  label input {
    margin-left:1rem;
  }

  label span {
    width: 100px;
    display: inline-block;
  }

</style>
