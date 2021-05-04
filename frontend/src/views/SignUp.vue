<template>
  <div class="container">
    <div class="row">
      <div class="col-md-5  mb-5">
        <h1>&nbsp;</h1>
      </div>
    </div>

    <div class="row d-flex justify-content-center mt-5 mb-3">
      <div class="col-md-12">
        <div>
          <div class="row d-flex justify-content-center">
            <div class="col-md-6">
              <img id="user-logo" class="img-fluid" src="@/assets/icons/user(2).png" alt="User logo">
            </div>
          </div>
        </div>

        <div v-if="errors.length > 0">

          <h2 style="color: white">Existen errores. Corrijalos</h2>

          <div class="alert alert-danger text-justify">
            <ul v-for="error in errors">
              <li> {{error}}</li>
            </ul>
          </div>
        </div>

        <div class="row d-flex justify-content-center mt-3">
          <div class="col-md-5">
            <form @submit.prevent="check">
              <b-form-group label="Full Name *" label-for="completeName" class="text-light" label-align="left">
                <input type="text" v-model="fullName" class="form-control" id="completeName" placeholder="Full Name">
              </b-form-group>
              <b-form-group label="Username *" label-for="username" class="text-light" label-align="left">
                <input type="text" v-model="username" class="form-control" id="username" placeholder="Username">
              </b-form-group>
              <b-form-group label="E-mail *" label-for="email" class="text-light" label-align="left">
                <input type="email" v-model="email" class="form-control" id="email" placeholder="Email">
              </b-form-group>
              <b-form-group label="Birth Date *" label-for="datepicker" class="text-light" label-align="left">
                <date-picker v-model="birthDate"></date-picker>
              </b-form-group>
              <b-form-group label="Location *" label-for="location" class="text-light" label-align="left">
                <b-form-select name="location"  id="location" v-model="locationSelected">
                  <option :value="location" v-for="location in locations">{{location}}</option>
                </b-form-select >
              </b-form-group>
              <b-form-group label="Password *" label-for="password" class="text-light" label-align="left">
                <input type="password" v-model="password" class="form-control" id="password" placeholder="Password">
              </b-form-group>
              <b-form-group label="Confirm Password *" label-for="confirmPassword" class="text-light" label-align="left">
                <input type="password" v-model="confirmPassword" class="form-control" id="confirmPassword" placeholder="Confirm password">
              </b-form-group>

              <b-form-checkbox
                  id="checkbox-1"
                  v-model="statusTerms"
                  name="checkbox-1"
                  class="text-light text-justify my-3"
              >I accept the <router-link :to="{name: 'terms'}" class="text-light text-underline">terms and use *</router-link>
              </b-form-checkbox>

              <b-form-checkbox
                  id="checkbox-2"
                  v-model="statusPrivacy"
                  name="checkbox-2"
                  class="text-light text-justify my-3"
              >I've read the <router-link :to="{name: 'privacy'}" class="text-light">privacy policy *</router-link>
              </b-form-checkbox>
              <button type="submit" class="btn text-light btn-success">Sign Up <img style="height: 30px; width: 30px;" src="@/assets/icons/key.png" alt="Key"></button>
            </form>
          </div>
        </div>

        <div class="row d-flex justify-content-center mt-4">
          <div class="col-6 col-md-4">
            <router-link class="text-light" :to="{name: 'forgot'}">Forgot password?</router-link>
          </div>
          <div class="col-6 col-md-4">
            <router-link class="text-light" :to="{name: 'Login'}">Login</router-link>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
import {doSignup} from '../../services/auth.services';

export default {
  name: "SignUp",
  components: {
    DatePicker
  },
  data: () => {
    return {
      locations: ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia","Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"],
      locationSelected: null,
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      errors: [],
      signupComplete: false,
      birthDate: null,
      statusTerms: false,
      statusPrivacy: false
    }
  },
  methods: {
    check: function(){
      this.errors = [];

      let regName = new RegExp("^[a-zA-Z\\s]*$");
      let regUsername = new RegExp("^[A-Za-z]\\w*$");
      let regEmail = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$");
      let regPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

      if (!regName.test(this.fullName) || this.fullName.length < 1){
        this.errors.push("Su nombre no puede contener números o estar vacío.");
      }

      let age =  this.birthDate ? this.getAge(this.birthDate.toString()) : -1;

      if (!this.birthDate || age < 18){
        this.errors.push("Debe indicar su fecha de nacimiento. La edad mínima requerida es 18 años");
      }

      if (!regUsername.test(this.username)){
        this.errors.push("Su nombre de usuario puede empezar con un número o estar vacío. Solo se admiten caracteres alfanumericos");
      }

      if (!regEmail.test(this.email)){
        this.errors.push("Reglas del correo: 1.No puede dejar el campo vacio. 2. Dominio minimo 2 caracteres.")
      }

      if (!this.locationSelected){
        this.errors.push("Debe elegir la localización donde se encuentra");
      }

      if (!regPassword.test(this.password)){
        this.errors.push("Reglas de la contraseña: 1. Minimo 8 caracteres. 2. Minimo una letra minuscula. 3. Minimo una letra mayuscula" +
            " 4. Al menos un caracter especial. 5. Al menos un numero")
      }

      if (this.confirmPassword !== this.password){
        this.errors.push("Las contraseñas no coinciden");
      }

      if (!this.statusTerms){
        this.errors.push("Debe aceptar los términos");
      }

      if (!this.statusPrivacy){
        this.errors.push("Debe aceptar la política de privacidad");
      }

      this.signupComplete = this.errors.length === 0;

      if (this.signupComplete){
        const signupErrors = async (cb) => {
          let data = await doSignup({
             email: this.email,
             password: this.password,
             confirmPassword: this.confirmPassword,
             name: this.fullName,
             username: this.username,
             birthDate: this.birthDate,
             location: this.locationSelected,
             statusTerms: this.statusTerms,
             statusPrivacy: this.statusPrivacy
           });

          if (data !== undefined && data.length > 0) {
            this.errors = data
            return;
          }

          cb(data.message);
        }

        signupErrors(message => {
          this.$router.push({name: "Login", params: {message}})
        });
      }
    },
    getAge(dateString) {
      let today = new Date();
      let birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age;
    }
  }
}
</script>

<style scoped>
#user-logo {height: 120px;}

</style>