const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Staff','Super Admin','Youth'], required: true },
    status: { type: String, enum: ['Active', 'Suspended'], default: 'active' }
});

const BarangaySchema = new mongoose.Schema({
    barangay: { type: String, required: true },
    puroks: [{ type: String, required: true }]
});

const SeniorCitizenSchema = new mongoose.Schema({
    reference_code: { type: String },
  
    identifying_information: {
      name: {
        last_name: { type: String, required: true },
        first_name: { type: String, required: true },
        middle_name: { type: String },
        extension: { type: String }
      },
      address: {
        barangay: { 
          type: String, 
          required: true,
          enum: [
            'Barangay 1', 
            'Barangay 2', 
            'Barangay 3', 
            'Barangay 4', 
            'Barangay 5', 
            'Barangay Mambulac', 
            'Barangay Guinhalaran', 
            'Barangay E-Lopez',
            'Barangay Bagtic', 
            'Barangay Balaring', 
            'Barangay Hawaiian',
            'Barangay Patag', 
            'Barangay Kapt.ramon', 
            'Barangay Guimbalaon',
            'Barangay Rizal', 
            'Barangay Lantad'
          ]
        },
        purok: { type: String, required: true }
      },
      date_of_birth: { type: Date }, // Will be populated from birthday field
      age: { type: Number, required: true },
      place_of_birth: { type: [String] }, // Array to match form field
      marital_status: { 
        type: String, 
        required: true,
        enum: [
          'Single but Head of the Family',
          'Single',
          'Married',
          'Widowed',
          'Separated',
          'Divorced'
        ]
      },
      gender: { 
        type: String, 
        required: true,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say'] 
      },
      contacts: [{
        type: { 
          type: String, 
          enum: ['primary', 'secondary', 'emergency'],
          required: true
        },
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String }
      }],
      osca_id_number: { type: String }, // Matches osca_id
      gsis_sss: { type: String },      // Matches gsis_sss_no
      philhealth: { type: String },    // Matches philhealth_no
      sc_association_org_id_no: { type: String }, // Matches sc_association_id
      tin: { type: String },           // Matches tin_no
      other_govt_id: { type: String },
      service_business_employment: { type: String }, // Matches service
      current_pension: { type: String },  // Matches pension
      capability_to_travel: { // Added to match your form
        type: String,
        enum: ['Yes', 'No']
      }
    },
  
    family_composition: {
      spouse: {
        name: { type: String }  // Matches spouse_name
      },
      father: {
        last_name: { type: String },
        first_name: { type: String },
        middle_name: { type: String },
        extension: { type: String }
      },
      mother: {
        last_name: { type: String },
        first_name: { type: String },
        middle_name: { type: String }
      },
      children: [{
        full_name: { type: String },
        occupation: { type: String },
        income: { type: String },  // String to handle empty values
        age: { type: Number },
        working_status: { 
          type: String,
          enum: ['working', 'not_working', 'studying'] 
        }
      }]
    },
  
    education_hr_profile: {
      educational_attainment: {
        type: [String],
        enum: [
  'Yes', 
  'No',
  'Elementary Level', 
  'Elementary Graduate',
  'High School Graduate',
  'College Level', 
  'College Graduate',
  'Post Graduate', 
  'Vocational', 
  'Not Attended School'
]
      },
      skills: [{
        type: String,
        enum: [
  'Medical',
  'Dental',
  'Fishing',
  'Engineering',
  'Barber',
  'Evangelization',
  'Millwright',
  'Teaching',
  'Counseling',
  'Cooking',
  'Carpenter',
  'Mason',
  'Tailor',
  'Legal Services',
  'Farming',
  'Arts',
  'Plumber',
  'Sapatero',
  'Chef/Cook'
]
      }],
      skill_other_text: { type: String }  // For "Others, specify" field
    }
  }, { timestamps: true });
  
  // Middleware to clean data before saving
  SeniorCitizenSchema.pre('save', function(next) {
    // Clean education_level array
    if (this.education_hr_profile?.educational_attainment) {
      this.education_hr_profile.educational_attainment = 
        this.education_hr_profile.educational_attainment
          .filter(val => val !== 'Yes' && val !== 'No');
    }
    
    // Handle "Other" skills
    if (this.education_hr_profile?.skills?.includes('Other') && 
        this.education_hr_profile?.skill_other_text) {
      this.education_hr_profile.skills = this.education_hr_profile.skills
        .filter(skill => skill !== 'Other');
      this.education_hr_profile.skills.push(this.education_hr_profile.skill_other_text);
    }
    
    // Convert birthday string to Date if needed
    if (this.identifying_information?.date_of_birth && 
        typeof this.identifying_information.date_of_birth === 'string') {
      this.identifying_information.date_of_birth = new Date(this.identifying_information.date_of_birth);
    }
    
    next();
  });

const pwdRegistrationSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  middle_name: { type: String },
  last_name: { type: String, required: true },

  barangay: { type: String, required: true },
  purok: { type: String, required: true },

  birthday: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'], required: true },

  place_of_birth: { type: String, required: true },
  civil_status: { type: String, enum: ['Single but Head of the Family', 'Single', 'Married'], required: true },
  spouse_name: { type: String },

  contacts: [
    {
      type: { type: String, enum: ['primary', 'secondary', 'emergency'], required: true },
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String }
    }
  ],

  fatherLastName: { type: String },
  fatherFirstName: { type: String },
  fatherMiddleName: { type: String },
  fatherExtension: { type: String },

  motherLastName: { type: String },
  motherFirstName: { type: String },
  motherMiddleName: { type: String },

  sss_id: { type: String, required: true },
  gsis_sss_no: { type: String, required: true },
  psn_no: { type: String, required: true },
  philhealth_no: { type: String, required: true },

  education_level: {
    type: String,
    enum: [
      'Elementary Level',
      'Elementary Graduate',
      'High School Graduate',
      'College Level',
      'College Graduate',
      'Post Graduate',
      'Vocational',
      'Not Attended School'
    ],
    required: true
  },
  employment_status: {
    type: String,
    enum: ['Employee', 'Unemployed', 'Self-employed'],
    required: true
  },
  employment_category: { 
    type: String, 
    enum: ['Government', 'Private'], 
    required: function() {
      return this.employment_status === 'Employee';
    },
    default: null 
  },
  employment_type: {
    type: String,
    enum: ['Permanent/Regular', 'Seasonal', 'Casual', 'Emergency'],
    required: function() {
      return this.employment_status === 'Employee';
    },
    default: null
  },

  disability: [String],
  disability_other_text: String,

  cause_disability: [String],
  cause_other_text: String,
});



const youthSchema = new mongoose.Schema({
  // Personal Information
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  middle_name: {
    type: String,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  barangay: {
    type: String,
    required: true
  },
  purok: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{11}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  birthday: {
    type: Date,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  place_of_birth: {
    type: String,
    required: true,
    trim: true
  },

  // Educational Attainment
  education_level: {
    type: String,
    required: true,
    enum: [
      'Elementary Level',
      'Elementary Graduate',
      'High School Graduate',
      'College Level',
      'College Graduate',
      'Post Graduate',
      'Vocational',
      'Not Attended School'
    ]
  },
  registered_sk: {
    type: String,
    required: true,
    enum: ['Yes', 'No']
  },
  voted_sk: {
    type: String,
    required: true,
    enum: ['Yes', 'No']
  },
  registered_national: {
    type: String,
    required: true,
    enum: ['Yes', 'No']
  },

  // Employment Information
  employment_status: {
    type: String,
    required: true,
    enum: ['Employee', 'Unemployed', 'Self-employed']
  },
  employment_category: {
    type: String,
    enum: ['Government', 'Private', null],
    default: null
  },
  employment_type: {
    type: String,
    enum: ['Permanent/Regular', 'Seasonal', 'Casual', 'Emergency', null],
    default: null
  },

  // KK Assembly Information
  Assembly: {
    type: String,
    required: true,
    enum: ['Yes', 'No']
  },
  sk_times: {
    type: String,
    enum: ['1-2', '3-4', '5+', null],
    default: null
  },
  reason: {
    type: String,
    enum: ['No KK Assembly Meeting', 'Not interested to attend', null],
    default: null
  },

  // Youth Classification (using arrays for multiple selections)
  youth_classification: {
    type: [String],
    enum: [
      'In School Youth',
      'Out of School Youth',
      'Youth w/Specific Needs',
      'Other'
    ]
  },
  youth_classification_other: {
    type: String,
    trim: true
  },

  // Youth Age Group (using arrays for multiple selections)
  youth_age_group: {
    type: [String],
    enum: [
      'Child Youth (15−17 yrs old)',
      'Core Youth (18−24 yrs old)',
      'Young Adult (15−30 yrs old)',
      'Other'
    ]
  },
  youth_age_group_other: {
    type: String,
    trim: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
youthSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model('User', UserSchema);
const SeniorCitizen  = mongoose.model('SeniorCitizen', SeniorCitizenSchema);
const Barangay = mongoose.model('Barangay', BarangaySchema);
const PWD = mongoose.model('PWD', pwdRegistrationSchema);
const Youth = mongoose.model('Youth', youthSchema);


module.exports = { User,SeniorCitizen ,Barangay,PWD };
