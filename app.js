const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

app.get("/",(req,res)=>{
    res.send("root");
});

//Index Route
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
});

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});

//Show Route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show",{listing});
});

//Create Route
/*app.post("/listings",async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});*/
app.post("/listings", async (req, res) => {
    let url = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200";
    let filename = "listingimage";
    const newListing = new Listing(req.body.listing);
    newListing.image = { url, filename };
    await newListing.save();
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id} = req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
});

//Update Route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

/*app.get("/testListing",async(req,res)=>{
    let sampleListing=new Listing({
        title:"My New Villa",
        description:"By the Beach",
        price:1200,
        location:"Goa",
        country:"India",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successfull testing");
});*/

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});