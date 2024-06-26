import { Document, Model } from "mongoose"
import { PostModel, Role, RoleModel, SessionModel, User, UserModel } from "../models"
import { Router, Response, Request} from "express"
import * as express from 'express'
import { SecurityUtils } from "../utils"
import { checkBody, checkUserRole, checkUserToken } from "../middleware"
import { RolesEnums } from "../enums"
import { checkQuery } from "../middleware/query.middleware"


export class UserController {

    readonly path: string
    readonly model: Model<User>
    guestRole: Role | null

    constructor(){
        this.path = "/user"
        this.model = UserModel
        this.guestRole = null
    }

    private loadGuestRole = async ():Promise<void> => {
        if (this.guestRole) {
            return
        }
        this.guestRole = await RoleModel.findOne({
            name: "guest"
        }).exec()
    }

    readonly paramsLogin = {
        "login" : "string",
        "password" : "string",
        "username" : "string",
        "image" : "string",
        "aboutMe" : "string",
        "joinDate" : "string",
    }

    subscribe = async (req: Request, res: Response):Promise<void> => {

        const login: string = req.body.login
        const password: string  = req.body.password


        try{


            await this.loadGuestRole()
            const user = await UserModel.create({
                login,
                password: SecurityUtils.toSHA512(password),
                username : req.body.username,
                roles:[this.guestRole],
                posts: [],
                image: req.body.image,
                aboutMe : req.body.aboutMe,
                joinDate : req.body.joinDate,
                follow: []
            })
            res.json(user)

        }catch(err: unknown){
            const me = err as {[key: string]: unknown}
            if (me['name'] === "MongoServerError" && me['code'] === 11000){
                res.status(409).json({"message": "The login is already in use."})
            }else{
                console.log(me)
                res.status(500).end()
            }
        }

    }

    readonly paramsUpdateUser = {
        "password" : "string | undefined",
        "image": "string | undefined",
        "aboutMe" : "string | undefined",
    }

    updateUser = async (req: Request, res: Response) => {
        const { currentPassword, password, ...userInfo } = req.body;
      
        try {
          const user = await UserModel.findById(req.user?._id);
      
          if (!user) {
            res.status(404).end();
            return;
          }
      
          // Compare hashed currentPassword with the user's password, if provided
          if (currentPassword) {
            const isCurrentPasswordValid = SecurityUtils.verifySHA512(
              currentPassword,
              user.password
            );
      
            if (!isCurrentPasswordValid) {
              res.status(400).json({ message: "Current password is incorrect" });
              return;
            }
          }
      
          let updated_user;
      
          // Create an update object with the new information, excluding password if not provided
          const updateData: any = {
            ...(password && { password: SecurityUtils.toSHA512(password) }),
            ...userInfo,
          };
      
          // Update the user document with the new information
          try {
            updated_user = await UserModel.findByIdAndUpdate(
              req.user?._id,
              updateData,
              { new: true }
            );
      
            if (!updated_user) {
              res.status(404).end();
              return;
            }
          } catch (e) {
            console.log(e);
            res.status(500).json({ message: "We were unable to update the user." });
            return;
          }
      
          res.status(200).json(updated_user);
          return;
        } catch (e) {
          console.log(e);
          res.status(500).json({ message: "We were unable to find the user." });
          return;
        }
      };
      

    

    me = async (req:Request, res: Response) => {
        res.json(req.user)
    }

    getAllUsersInfo = async (req:Request, res:Response): Promise<void> => {
        const return_list: (Document<unknown, {}, User> & User & Required<{ _id: string }>)[] = []

        const users = await UserModel.find({"_id": {"$ne": req.user?._id}})
        if(!users){
            res.status(404).json({"message" : "No users"})
            return
        }
        users.forEach(user => {
            user.password = ""
            user.roles = []
            return_list.push(user)
        })

        res.status(200).json(return_list)
        return 
    }

    readonly paramsGiveRole = {
        "user_id" : "string",
        "role" : "string"
    }

    addRole = async (req:Request, res:Response): Promise<void> => {

        if(!req.user){res.send(401).end(); return}

        // Check that we don't assign roles to ourselves 
        if ( req.body.user_id === String(req.user._id)){
            res.status(409).json({"message" : "You can't assign roles to yourself"})
            return
        }

        try{
            const role = await RoleModel.findById(req.body.role)
            const user = await UserModel.findById(req.body.user_id)
            if(!role || !user){res.status(404).json({"message" : "Role or User not found"}); return}
            if(!user.roles.some(userRole => String(role._id) === String(userRole._id))){
                user.roles.push(role)
                user.save()
                res.status(200).json({"message" : "Role assign"})
                return 
            }
        
            res.status(409).json({"message" : "The user already has the role"})
            return

        }catch(err){
            res.status(400).json({"message" : "One of the ID is incorrect"})
            return
        }
    }

    getRoles = async (req: Request, res: Response): Promise<void> => {

        const roles = await RoleModel.find({})

        res.send(roles)
    }

    getAllUsers = async (req:Request, res: Response): Promise<void> => {
        const users = (await UserModel.find({})).length

        res.status(200).json(users)
    }

    getOneUser = async (req: Request, res: Response): Promise<void> => {
        if(!req.query.id || typeof req.query.id !== "string"){
            res.status(400).end()
            return
        }

        let user
        try{
            user = await UserModel.findById(req.query.id).populate("roles")
            if(user){
                user.password = ""
                user.roles = []
            }
        }catch(e){
            res.status(404).json("User not found")
        }

        res.status(200).json(user)
    }
  

    readonly queryGetPost = {
        "user_id" : "string | undefined"
    }

    getAllPost = async (req:Request, res:Response): Promise<void> => {

        if (!req.query.user_id && req.user){
            res.status(200).json((await req.user.populate("posts")).posts)
            return
        }

        try{
            const user = await UserModel.findById(req.query.user_id).populate("posts")
            if (!user){
                res.status(404).json({'message': "User not found"})
                return 
            }
            res.status(200).json(user.posts)
            return 
        }catch(err){
            res.status(500).json({'message': "Server error"})
            return 
        }
    
    }


  
    readonly queryValidatePost = {
        "post_id" : "string"
    }

    validatePost = async (req:Request, res:Response): Promise<void> => {
    
        try{
            const post = await PostModel.findById(req.query.post_id)
            if(!post){
                res.status(404).json({"message" : "Post not found"})
                return 
            }
            if(!req.user){
                res.status(500).end()
                return 
            }       
            // Check that the user hasn't already validated the post
            if(post.whoValidates.some(validator => String(validator) === String(req.user?._id))){
                res.status(406).json({"message" : "You have already validated this post"})
                return
            }
            
            post.whoValidates.push(req.user)
            post.save()
            

            res.status(200).json({"message" : "You validate this post"})
            return


        }catch(err){
            res.status(400).json({"message" : "This is not a Post Id"})
            return
        }
    }

    readonly queryFollow = {
        "user_id" : "string"
    }

    follow = async (req:Request, res:Response): Promise<void> => {

        if ( !req.user || req.user._id == req.query.user_id){
            res.status(400).json({"message": "You can't follow yourself"})
            return 
        }

        try{
            const follow_user = await UserModel.findById(req.query.user_id)
            if (!follow_user){
                res.status(404).json({"message" : "We can't find this user"})
                return 
            }

            if (req.user.follow.includes(req.query.user_id)) {
                res.status(400).json({ message: "You are already following this user" });
                return;
              }
            req.user?.follow.push(follow_user)
            req.user?.save()

            res.status(200).send("OK")
            return 
        }catch(e){
            console.log(e);
            res.status(400).json({"message" : "This is not a user's ID"})
            return
        }


    }

    readonly queryUnfollow={
        "user_id" : "string"
    }

    unfollow = async (req: Request, res: Response): Promise<void> => {
        // Logic to unfollow a user
      
        // Assuming you have the user ID of the user to unfollow in req.body.userId
        const userIdToUnfollow = req.query.user_id;
      
        console.log("id",userIdToUnfollow);
        try {
            if (req.user && req.user.follow) {
                console.log("user:",req.user)

                // Filter out the user with the specified ID from req.user.follow
                req.user.follow = req.user.follow.filter((userId) => userId.toString() !== userIdToUnfollow);
                console.log("follows;",req.user.follow)
              } 
              req.user?.save() // Send a success response if the unfollowing was successful
          res.status(200).json({ message: 'Unfollowed user successfully' });
        } catch (error) {
          // Handle any errors that occurred during the unfollowing process
          console.error('Error unfollowing user:', error);
          res.status(500).json({ error: 'Failed to unfollow user' });
        }
      };
      

    getFollower = async (req:Request, res:Response):Promise<void> => {
            return 
    }
     deleteMe = async (req: Request, res: Response) => {
        try {
          const user = req.user;
      
          if (!user) {
            throw new Error('User not found'); // or handle it differently based on your requirements
          }
      
          // Delete the user document from MongoDB
          await UserModel.findByIdAndDelete(user._id);
          // Respond with the deleted user information
          res.json(user);
        } catch (error) {
          // Handle any errors that may occur during the deletion process
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };

    deleteOneUser = async (req: Request, res: Response): Promise<void> => {
        if(!req.query.id || typeof req.query.id !== "string"){
            res.status(400).end()
            return
        }

        let user
        try{
            user = await UserModel.findById(req.query.id).populate("roles")
            if(user){
                user.password = ""
                user.roles = []
            }
        }catch(e){
            res.status(404).json("User not found")
        }

        res.status(200).json(user)
    }

    getAllSession = async (req:Request, res:Response) => {
        try{
            const sessions = await SessionModel.find({
                user: req.user?._id
            })
            if (!sessions){
                res.status(404).json({"message": "Liar, how there is no session ?"})
                return
            }

            res.status(200).json(sessions)
        }catch(e){
            res.status(500).end()
            return 
        }
    }

    buildRouter = (): Router => {
        
        const router = express.Router()
        router.post(`/subscribe`, express.json(), checkBody(this.paramsLogin), this.subscribe.bind(this))
        router.get('/follow', express.json(), checkUserToken(), this.getFollower.bind(this))
        router.get('/me', checkUserToken(), this.me.bind(this))
        router.get('/count', checkUserToken(), checkUserRole(RolesEnums.admin), this.getAllUsers.bind(this))
        router.get('/one', checkUserToken(), checkUserRole(RolesEnums.guest), this.getOneUser.bind(this))
        router.get('/role', checkUserToken(), checkUserRole(RolesEnums.admin), this.getRoles.bind(this)) // Return the list of all possible roles
        router.get('/post', checkUserToken(), checkQuery(this.queryGetPost), this.getAllPost.bind(this))
        router.get('/all', checkUserToken(), this.getAllUsersInfo.bind(this))
        router.get('/sessions', checkUserToken(), this.getAllSession.bind(this))
        router.post('/unfollow',checkUserToken(), checkQuery(this.queryUnfollow),this.unfollow.bind(this))
        router.patch('/', express.json(), checkUserToken(), checkBody(this.paramsUpdateUser), this.updateUser.bind(this))
        router.patch('/validate', express.json(), checkUserToken(), checkQuery(this.queryValidatePost), this.validatePost.bind(this))
        router.patch('/role', express.json(), checkUserToken(), checkUserRole(RolesEnums.admin), checkBody(this.paramsGiveRole), this.addRole.bind(this))
        router.post('/follows', express.json(), checkUserToken(), checkQuery(this.queryFollow), this.follow.bind(this))
        router.delete('/me', checkUserToken(), this.deleteMe.bind(this))
        router.delete('/one', checkUserToken(), checkUserRole(RolesEnums.admin), this.deleteOneUser.bind(this))
        return router
    }
}