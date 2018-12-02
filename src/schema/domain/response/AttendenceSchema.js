import SchemaObject from 'schema-object';

const AttendenceSchema = new SchemaObject({
        emailid: String,
        status: Number,
        time: String,
    },
    {
        constructors: {
            // Override default constructor
            default: function (values) {
                // Will call this.populate
                this.emailid = values.emailid;
                this.attendance = values.status;
                this.time = values.status == 1 ? values.in_time :values.out_time;
            },
        }
    });

export default AttendenceSchema;
