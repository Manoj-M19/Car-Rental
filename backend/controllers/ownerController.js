import User from "../models/User.js";
import imagekit from "../configs/imagekit.js";
import fs from "fs"
import Car from "../models/Car.js";

export const changeRoleToOwner = async (req,res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id,{role:"owner"})
        res.json({success:true,message:"Now you can list cars"})
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }

}

export const addCar = async (req,res) => {
    try {
        const {_id} = req.user;
        let car = JSON.parse(req.body.carData)
        const imageFile = req.file;

        const fileBuffer = FileSystem.readFileSync(imageFile.path)
       const response =  await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:'/cars'
        })

        var optimizedImageUrl = imagekit.url({
            path:response.filePath,
            transformation:[
                {width:'1280'},
                {quality:'auto'},
                {format:'webp'}
            ]
        });

        const image = optimizedImageUrl;
        await Car.create({...car,owner:_id,image})

        res.json({success:true,message:"Car Added"})

    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

export const getOwnerCars = async (req,res) => {
    try {
        const {_id} = req.user;
        const cars = await Car.find({owner:_id})
        res.json({success:true,cars})
    } catch (error) {
        console.log(error.message);
        res.josn({success:false,message:error.message})
    }
}

export const toggleCarAvailability = async (req,res)=> {
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        if(car.owner.toString() !==_id.toString()) {
            return res.json({ success:false,message:"Unauthorized"});
        }

        car.isAvailable = !car.isAvailable;
        await car.save()
        res.json({success:true,message:"Availability Toggled"})

    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

export const deleteCar = async (req,res)=> {
    try {
        const {_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        if(car.owner.toString() !==_id.toString()) {
            return res.json({ success:false,message:"Unauthorized"});
        }

        car.owner = null;
        car.isAvailable = false;
        await car.save()
        res.json({success:true,message:"Car Removed"})
        
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

export const getDashboardData = async (req,res) => {
    try {
        const {_id,role} = req.user;

        if(role !== 'owner') {
            return res.json({ success:false,message:"Unauthorized"})
        }

    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }

}