const express = require("express");
const app =express();
const mongoose = require("mongoose");
const Club = require("./models/club.js");
const port = process.env.PORT || 8080;
const Login = require("./models/login.js");
const { error } = require("console");
const SignUp = require("./models/signUp.js");
const multer = require('multer');
const Feedback = require("./models/feedback.js");
const ALogin = require("./models/admin.js");
const Event = require('./models/events');
const path = require("path");
require("dotenv").config();
const methodOverride = require("method-override");
//const ExpressError = require("./ExpressError.js")
console.log("Connecting to:", process.env.MONGO_URI);

main()
  .then(() => console.log("✅ MongoDB connection successful"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function main(){
    await mongoose.connect(process.env.MONGO_URI);
}

// async function testConnection() {
//   try {
//     await mongoose.connect("mongodb+srv://Sayali_2005:Sayali%402307@cluster0.glxcwcm.mongodb.net/CollegeSIGCE?retryWrites=true&w=majority&appName=Cluster0");
//     console.log("✅ Connected to MongoDB");
//     process.exit();
//   } catch (err) {
//     console.error("❌ MongoDB connection failed:", err);
//   }
// }

// testConnection();

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"../public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// Body parser middleware
app.use(express.json());

// Set up Multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the folder where images will be saved (absolute path)
        cb(null, 'D:/Patience/Level2/CLub_Images'); // Path to your folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Use a unique name for each file
    },
});
// Define the file filter for only accepting image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Only image files are allowed'), false); // Reject the file
    }
};
// Set up Multer with storage and limits for file size if necessary
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }  // 10MB limit (optional)
}).array('clubImages', 10); // Handling multiple files (up to 10)

const upload2 = multer({ storage: storage }).array('eventImages', 2);

// Middleware to serve static files from the specified directory
app.use('/Club_Images', express.static('D:/Patience/Level2/CLub_Images')); // Serve images from this directory
app.use('/eventImages', express.static('D:/Patience/Level2/CLub_Images'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// let club1 = new Club({ 
//     clubName:"One",
//     clubDescription:"Two",
//     clubImages:"three",
//     studentName:"four",
//     studentRole:"five",
//     facultyName:"six",
//     facultyRole:"seven",
//     contactEmail:"eight",
//     contactPhone:9122,
//     created_at : new Date(),
// });

// club1
//     .save()
//     .then((res)=>{
//         console.log(res);
//     })
//     .catch((err)=>{
//         console.log(err);
//     });

app.get("/dbstatus", (req, res) => {
  const state = mongoose.connection.readyState;
  res.send({ connected: state === 1 ? true : false });
});


//Normal join Route
app.get("/clubs/join",async(req,res,next)=>{
    try{ 
        res.render("join.ejs")
    }
    catch(err){
        next(err);
    }
}); 
app.post("/clubs/join",async(req,res,next)=>{
    try{ 
        res.redirect("/clubs");
    }
    catch(err){
        next(err);
    }
});

// Signup Page (GET)
app.get("/signUp", async (req, res) => {
    res.render("signup.ejs", { error: null }); // Pass default error to avoid EJS crash
});

// Signup Handler (POST)
app.post("/signUp", async (req, res) => {
    let { name, email, collegeID, password, year, branch } = req.body;

    try {
        // Validate the College ID format
        const regex = /^\d{4}[a-zA-Z]{2}\d{2}[a-zA-Z]@sigce\.edu\.in$/;
        if (!regex.test(collegeID)) {
            return res.render("signup.ejs", {
                error: "Invalid College ID format! Please follow the correct format."
            });
        }

        // Check if email is already registered
        const existingStudent = await SignUp.findOne({ email: email });
        if (existingStudent) {
            return res.render("signup.ejs", {
                error: "Email is already registered. Please use a different one or log in."
            });
        }

        // Save the new student
        let newStudent = new SignUp({
            name,
            email,
            collegeID,
            password,
            year,
            branch,
        });

        await newStudent.save();
        console.log("Data was saved!!");

        // Redirect after success
        res.redirect("/clubs");

    } catch (err) {
        console.log("Signup error:", err);
        res.render("signup.ejs", {
            error: "There was an issue with saving your data. Please try again."
        });
    }
});


//Login Route
app.get("/login",async(req,res)=>{
    res.render("login.ejs",{error:null});
});
app.post("/login",async(req,res)=>{
    // let {email,password,} = req.body;
    try{
        const user = await SignUp.findOne({email : req.body.email});
        if(user){
            const result = req.body.password ===user.password;
            if(result){
                // res.render("home2.ejs");
                res.redirect("/clubs");
            }
            else{
                // res.status(400).json({error:"Password doesn't match"});
                res.render("login.ejs",{
                    error:"Password doesn't match"
                })
            }
        }    
        else{
                // res.status(400).json({
                //     error:"User doesn't match"
                // });
                res.render("login.ejs",{
                    error:"User doesn't match"
                });
            }    
        }
        catch(err){
                res.status(400).json({error});
            }           
    }
);

//Admin Login Route
app.get("/alogin",async(req,res)=>{
    res.render("alogin.ejs",{error:null});
});
app.post("/alogin", async (req, res) => {
    try {
        const user = await ALogin.findOne({ email: req.body.email });
        if (user) {
            const result = req.body.password === user.password;
            if (result) {
                let clubs = await Club.find();
                let feedbacks = await Feedback.find();
                  // Pass an object containing both 'clubs' and 'feedbacks' to the view
                res.render("admin", { clubs: clubs, feedbacks: feedbacks });  // No need for '.ejs' extension  // No need for '.ejs' extension
            } else {
                res.render("alogin", {
                    error: "Password doesn't match"
                });
            }
        } else {
            res.render("alogin", {
                error: "Admin ID doesn't match"
            });
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(400).json({ error: err.message });
    }
});


//Index Route
app.get("/clubs",async(req,res,next)=>{
    try{
        let clubs = await Club.find();
        //console.log(chats);
        res.render("index.ejs",{clubs});
    }
    catch(err){
        next(err)
    }
});    


//join Route
app.post("/clubs/:id/join",async(req,res,next)=>{
    try{ 
        let {id} = req.params;
        let club = await Club.findById(id);
        res.render("join.ejs",{club});
    }
    catch(err){
        next(err);
    }
})

//New Route
app.get("/clubs/new",(req,res)=>{
    // throw new ExpressError(404,"Page not found!");
    res.render("new.ejs");
});


// Helper function to check if the ID is a valid ObjectId
function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}
//add Events held by clubs
app.post('/clubs/:id/submit-event', upload2, async (req, res) => {
    const clubId = req.params.id;
    if (!isValidObjectId(clubId)) {
        return res.status(400).send('Invalid club ID');
    }
    try {
        // Creating a new event using the form data and uploaded file paths
        const event = new Event({
            eventName: req.body.eventName,
            eventDate: req.body.eventDate,
            eventImages: req.files.map(file => `/eventImages/${file.filename}`), // Save relative paths
// Save the file paths
            detailedDescription: req.body.detailedDescription,
            clubId 
        });
        // Save the event to the database
        await event.save();
        res.redirect(`/clubs/${clubId}`);
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving event');
    }
});

//Create Route
app.post("/clubs",upload,async(req,res,next)=>{
    try{
          // Check if files were uploaded
          if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }
        let {clubName,clubDescription,branch,
            facultyName,facultyRole,studentName,
            studentRole,contactEmail,contactPhone} = req.body;
        let clubImages = req.files.map(file => `/Club_Images/${file.filename}`);   
        // Map student and faculty data into the correct format
        const studentCoordinators = studentName.map((name, index) => ({
            name,
            role: studentRole[index]
        }));

        const facultyCoordinators = facultyName.map((name, index) => ({
            name,
            role: facultyRole[index]
        }));
        let newClub = new Club({
        clubName :clubName,
        clubDescription:clubDescription,
        clubImages:clubImages,
        branch:branch,
        studentCoordinators: studentCoordinators, // Store multiple students
        facultyCoordinators: facultyCoordinators, // Store multiple faculties
        contactEmail:contactEmail,
        contactPhone:contactPhone,
        created_at: new Date(),
        });
        
        console.log(req.files);  // Check the array of uploaded files

        await newClub
        .save()
        // .then((res)=>{console.log("Chat was saved!!")})
        // .catch((err)=>{console.log(err)});
        res.redirect("/clubs");
    }
    catch(err){
        next(err);
    };
});


//NEW - Show Route (just created to understand error handling)
app.get("/clubs/:id",async(req,res,next)=>{
    try{
        // let {id} = req.params;
        // let club = await Club.findById(id);
        // let event = await Event.findById(id);
        // if(!club&&!event){
        //     console.log(404,"Club not found!");
        // }
        // res.render("show.ejs",{club},{event});
        let { id } = req.params;
        let club = await Club.findById(id);
        // Ensure you're fetching events related to the club
        let event = await Event.find({ clubId: id }); // Assuming there's a clubId field on the Event model

        if (!club) {
            console.log("404: Club not found!");
            return res.status(404).send("Club not found");
        }

        // Render the page with club and events data
        res.render("show.ejs", { club: club, event: event });
    }
    catch(err){
        next(err);
    }
});

//Edit Route
app.get("/clubs/:id/edit",async(req,res,next)=>{
    try{
        let {id} = req.params;
        let club = await Club.findById(id);
        res.render("edit.ejs",{club});
    }
    catch(err){
        next(err);
    }
})
//update route
app.put("/clubs/:id", async (req, res) => {
    try {
        const clubId = req.params.id;
        const { 
            clubName, 
            clubDescription, 
            clubImages, 
            branch, 
            contactEmail, 
            contactPhone, 
            studentName, 
            studentRole, 
            facultyName, 
            facultyRole 
        } = req.body;

        // Process student coordinators and faculty coordinators
        const studentCoordinators = studentName.map((name, index) => ({
            name,
            role: studentRole[index]
        }));

        const facultyCoordinators = facultyName.map((name, index) => ({
            name,
            role: facultyRole[index]
        }));

        const updatedImages = clubImages ? clubImages.split(',').map(image => image.trim()) : undefined;

        // Update the club
        const updatedClub = await Club.findByIdAndUpdate(
            clubId,
            {
                clubName,
                clubDescription,
                clubImages: updatedImages,
                branch,
                contactEmail,
                contactPhone,
                studentCoordinators,
                facultyCoordinators
            },
            { new: true } // Return the updated club object
        );

        if (!updatedClub) {
            return res.status(404).send('Club not found');
        }

        res.redirect(`/clubs/${updatedClub._id}`);

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while updating the club.");
    }
});




//Destroy Route
app.delete("/clubs/:id",async(req,res,next)=>{
    try{
    let {id} = req.params;
    let deletedClub = await Club.findByIdAndDelete(id);
    console.log(deletedClub);
    res.redirect("/clubs");
    }
    catch(err){
        next(err);
    }
});

//Feedback form
app.post("/feedback",async(req,res)=>{
    let {name,email,mobileno,message} = req.body;
    try{
        let newMessage = new Feedback({
            name : name,
            email:email,
            mobileno:mobileno,
            message:message
        });
        await newMessage
            .save()
            .then((res)=>{console.log("Data was saved!!")})
            .catch((err)=>{console.log(err)});   
    }
    catch(err){
        console.log(err);
    };
    // res.render("home2.ejs");
    res.redirect("/clubs#contactus-div");
});

app.post('/delete-feedback/:id', async (req, res) => {
    try {
        const feedbackId = req.params.id;

        // Delete the feedback from the database by its ID
        await Feedback.findByIdAndDelete(feedbackId);

        // Redirect back to the admin page after deletion
        res.redirect('/admin'); // or wherever you want to go after deletion
    } catch (err) {
        console.error("Error deleting feedback:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/admin', async (req, res) => {
    try {
        let clubs = await Club.find();
        let feedbacks = await Feedback.find();
        res.render('admin', { clubs: clubs, feedbacks: feedbacks });
    } catch (err) {
        console.error("Error fetching admin data:", err);
        res.status(500).send('Error loading admin page');
    }
});



//DeptClubs
app.get("/deptClubs",async(req,res)=>{
    res.render("deptClubs.ejs");
});

app.get("/deptClubs/computer",async(req,res)=>{
    let clubs = await Club.find({branch:"computer"});
    res.render("./deptClubs/computer_clubs.ejs",{clubs});
});
app.get("/deptClubs/iot",async(req,res)=>{
    let clubs = await Club.find({branch:"iot"});
    res.render("./deptClubs/iot_clubs.ejs",{clubs});
});
app.get("/deptClubs/electrical",async(req,res,next)=>{
    // try{
    //     let clubs = await Club.find({branch:"electrical"});
    //      // Query the clubs by the branch value
    //      if (!clubs || clubs.length === 0) {  // Check if no clubs were found
    //         console.log("404", "Club not found!");
    //         return res.status(404).send("No clubs found for this branch.");
    //     }
    //     res.render("./deptClubs/electrical_clubs.ejs",{clubs});
    // }
    // catch(err){
    //     next(err);  // Pass the error to the next middleware
    // } 
    let clubs = await Club.find({branch:"electrical"});
    res.render("./deptClubs/electrical_clubs.ejs",{clubs});
});
app.get("/deptClubs/mechanical",async(req,res)=>{
    let clubs = await Club.find({branch:"mechanical"});
    res.render("./deptClubs/mechanical_clubs.ejs",{clubs});
});
app.get("/deptClubs/aids",async(req,res)=>{
    let clubs = await Club.find({branch:"aids"});
    res.render("./deptClubs/ai-ds_clubs.ejs",{clubs});
});
app.get("/deptClubs/aiml",async(req,res,next)=>{
    // try{
    //     let clubs = await Club.find({branch:"aiml"}); // Query the clubs by the branch value
    //      if (!clubs || clubs.length === 0) {  // Check if no clubs were found
    //         console.log("404", "Club not found!");
    //         return res.status(404).send("No clubs found for this branch.");
    //     }
    //     res.render("./deptClubs/ai-ml_clubs.ejs",{clubs});
    // }
    // catch(err){
    //     next(err);  // Pass the error to the next middleware
    // }   
    let clubs = await Club.find({branch:"aiml"});
    res.render("./deptClubs/ai-ml_clubs.ejs",{clubs});
});

//ShowDeptClubs
app.get("/deptClubs/:branch", async (req, res, next) => {
    // try {
    //     let { branch } = req.params;  // Get the branch from the URL parameters
    //     let club = await Club.find({ branch: branch });  // Query the clubs by the branch value
    //     if (!club || club.length === 0) {  // Check if no clubs were found
    //         console.log("404", "Club not found!");
    //         return res.status(404).send("No clubs found for this branch.");
    //     }
    //     res.render("show.ejs", { club });  // Render the show.ejs view with the found clubs
    // } catch (err) {
    //     next(err);  // Pass the error to the next middleware
    // }
    res.render("./deptClubs/computer_clubs.ejs")
});

app.post("/clubs/:id/event",async(req,res,next)=>{
    try{ 
        let {id} = req.params;
        let club = await Club.findById(id);
        res.render("eventForm.ejs",{club});
    }
    catch(err){
        next(err);
    }
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something went wrong');
});


app.get("/home",(req,res)=>{ 
    res.render("home.ejs");
});

app.get("/",(req,res)=>{
    res.send("Root is working well!!!!");
});

app.listen(port,()=>{
    console.log("Server is listening");
});
