var db = require('../config/connection')
var collection = require('../config/collection')
var bcrypt = require('bcryptjs')
const { ObjectId } = require('mongodb')
const userHelpers = require('./user-helpers')
const { response } = require('express')
const { promises } = require('nodemailer/lib/xoauth2')
const { ObjectID } = require('mongodb'); 

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {

            let username = await db.get().collection(collection.CTRLER_COLLECTION).findOne({ username: userData.username })
            console.log(username)
            if (username) {
                resolve({ status: false })
            } else {
                userData.password = await bcrypt.hash(userData.password, 10)
                db.get().collection(collection.CTRLER_COLLECTION).insertOne(userData).then((data) => {
                    userData.status = true
                    resolve(userData)

                })


            }
        })

    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.CTRLER_COLLECTION).findOne({ username: userData.username })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log("login success");
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("login Failed");
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("login failed");
                resolve({ status: false })
            }
        })
    },
    editFeedgetFeed: (feedId) => {
        return new Promise(async (resolve, reject) => {
            let feed = await db.get().collection(collection.FEED_COLLECTION).findOne({ _id: feedId })
            resolve(feed)
        })
    },
    editFeed: (feed, callback) => {
        console.log(feed);
        db.get().collection(collection.FEED_COLLECTION).updateOne({ _id: feed.feedId },
            {
                $set: {
                    title: feed.title,
                    description: feed.description,
                    date: feed.date,
                    image: feed.image
                }
            }).then((response) => {
                callback(response)
            })
    },
    addFeed: (feed) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FEED_COLLECTION).insertOne(feed).then((data) => {
                resolve(data)
            })
        })
    },
    getFeed: (feedId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FEED_COLLECTION).findOne({ _id: feedId }).then((feed) => {
                console.log(feed);
                resolve(feed)
            })
        })
    },
    updateFeed: (feed) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FEED_COLLECTION).updateOne({ _id: feed._id },
                {
                    $set: {
                        title: feed.title,
                        description: feed.description,
                        content: feed.content,
                        date: feed.date,
                        photo: feed.photo
                    }
                }).then((response) => {
                    resolve(response)
                })
        })
    },
    addPhoto: (photo) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PHOTO_COLLECTION).insertOne(photo).then((data) => {
                resolve(data)
            })
        })
    },
    getPhoto: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PHOTO_COLLECTION).find().sort({ _id: -1 }).toArray().then((photos) => {
                console.log(photos);
                resolve(photos)
            })
        })
    },
    addForm: (form) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FORM_COLLECTION).insertOne(form).then((data) => {
                resolve(data)
            })
        })
    },
    addAnnouncement : (announcement) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ANNOUNCEMENT_COLLECTION).insertOne(announcement).then((data) => {
                resolve(data)
            })
        })
    },
    addNotification : (notification) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.NOTIFICATION_COLLECTION).insertOne(notification).then((data) => {
                resolve(data)
            })
        })
    },
    getNotification : (notiId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.NOTIFICATION_COLLECTION).find({_id: notiId}).sort({ _id: -1 }).toArray().then((notification) => {
                
                resolve(notification)
            })
        })
    },
    getAnnouncement : (annId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ANNOUNCEMENT_COLLECTION).find({_id: annId}).sort({ _id: -1 }).toArray().then((announcement) => {
                
                resolve(announcement)
            })
        })
    },

    //Computer Lab
    doSuperSignup:(userData)=>{
        return new Promise(async (resolve, reject) => {

            let username = await db.get().collection(collection.SUPERVISOR_COLLECTION).findOne({ username: userData.username })
            console.log(username)
            if (username) {
                resolve({ status: false })
            } else {
                userData.password = await bcrypt.hash(userData.password, 10)
                db.get().collection(collection.SUPERVISOR_COLLECTION).insertOne(userData).then((data) => {
                    userData.status = true
                    resolve(userData)

                })


            }
        })
    }, 
    doSuperLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.SUPERVISOR_COLLECTION).findOne({ username: userData.username })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log("login success");
                        response.user = user
                        response.status = true
                        resolve(response)
                    } else {
                        console.log("login Failed");
                        resolve({ status: false })
                    }
                })
            } else {
                console.log("login failed");
                resolve({ status: false })
            }
        })
    },
    addData: (data) => {
        return new Promise((resolve, reject) => {
          db.get().collection(collection.DATA_COLLECTIONS).insertOne(data)
            .then(async (response) => {
            //   if (data.userpurpose === "Personal" || data.userpurpose === "Class") {
            //     try {
            //       const userIdStr = data.userId;
            //       const userIdInt = parseInt(data.userId);
      
            //       // Attempt to find user data using userId as string
            //       let userData = await db.get().collection(collection.DATABASE_COLLECTIONS).findOne({ userId: userIdStr });
      
            //       // If not found, attempt to find user data using userId as integer
            //       if (!userData && !isNaN(userIdInt)) {
            //         userData = await db.get().collection(collection.DATABASE_COLLECTIONS).findOne({ userId: userIdInt });
            //       }
      
            //       if (userData) {
            //         // Add 5 to the rent
            //         const updatedRent = (userData.rent || 0) + 5;
            //         const updateResult = await db.get().collection(collection.DATABASE_COLLECTIONS).updateOne(
            //           { _id: userData._id },
            //           { $set: { rent: updatedRent } }
            //         );
      
            //         console.log(`Rent updated for userId ${userData.userId}: New rent is ${updatedRent}`);
            //         console.log("Update result:", updateResult);
            //       } else {
            //         // If no userData, initialize rent with 5 rupees
            //         const initialRent = 5;
            //         const newUserId = isNaN(userIdInt) ? userIdStr : userIdInt;
            //         const insertResult = await db.get().collection(collection.DATABASE_COLLECTIONS).insertOne({
            //           userId: newUserId,
            //           rent: initialRent
            //         });
      
            //         console.log(`Initialized rent for userId ${newUserId} with ${initialRent} rupees`);
            //       }
            //     } catch (error) {
            //       console.error("Error updating/inserting rent:", error);
            //       reject(error);
            //     }
            //   }
              resolve(response);
        //     })
        //     .catch((error) => {
        //       console.error("Error inserting data:", error);
        //       reject(error);
            });
        });
      },
      deleteData: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const dataId = data._id; // Use data._id directly assuming it's an ObjectId
    
                // Ensure dataId is provided
                if (!dataId) {
                    reject(new Error('Missing _id in data'));
                    return;
                }
    
                // Delete document from DATA_COLLECTIONS based on _id
                const deleteResult = await db.get().collection(collection.DATA_COLLECTIONS).deleteOne({ _id: dataId });
    
                if (deleteResult.deletedCount > 0) {
                    console.log(`Deleted document with _id ${dataId}`);
    
                    // Update rent based on the deleted data
                    await updateRentBasedOnPurpose();
    
                    resolve(deleteResult);
                } else {
                    console.log(`No document found with _id ${dataId}`);
                    resolve(null); // Resolve with null if no document was deleted
                }
            } catch (error) {
                console.error("Error deleting document:", error);
                reject(error);
            }
        });
    },
    
    updateRentBasedOnPurpose: () => {
        return new Promise(async (resolve, reject) => {
            try {
                // Check if the database is connected
                if (!db) {
                    throw new Error('Database connection not established');
                }
    
                console.log("Database connection established");
    
                // Aggregate data to calculate the sum of additional rent based on userpurpose entries for each userId
                const result = await db.get().collection(collection.DATA_COLLECTIONS).aggregate([
                    {
                        $match: {
                            userpurpose: { $in: ["Class", "Personal"] }
                        }
                    },
                    {
                        $group: {
                            _id: "$userId",
                            totalRentIncrement: { $sum: 5 } // Sum of rent increments for each matched userId
                        }
                    }
                ]).toArray();
    
                console.log("Aggregation result:", result);
    
                // Update rent for each userId based on the aggregation result
                for (let entry of result) {
                    const userId = entry._id;
                    const totalRentIncrement = entry.totalRentIncrement;
    
                    console.log(`Updating rent for userId: ${userId}, additionalRent: ${totalRentIncrement}`);
    
                    // Update the user's rent in the users collection
                    const updateResult = await db.get().collection(collection.DATABASE_COLLECTIONS).updateOne(
                        {
                            $or: [
                                { userId: userId },             // Match string userId
                                { userId: parseInt(userId) }    // Match integer userId
                            ]
                        },
                        { $inc: { rent: totalRentIncrement } }
                    );
    
                    if (updateResult.modifiedCount === 1) {
                        console.log(`Rent updated successfully for userId ${userId}`);
                    } else {
                        console.log(`No document found or updated for userId ${userId}`);
                    }
                }
    
                console.log("Rent updated based on userpurpose for all users.");
                resolve("Rent updated based on userpurpose for all users.");
            } catch (error) {
                console.error("Error updating rent based on userpurpose:", error);
                reject(error);
            }
        });
    },
//     deleteData: (data) => {
//         return new Promise((resolve, reject) => {
//             const dataId = data._id; // Directly use data._id since it's already an ObjectId
    
//             // Ensure dataId is provided
//             if (!dataId) {
//                 reject(new Error('Missing _id in data'));
//                 return;
//             }
    
//             // Convert dataId to ObjectId if it's a string
//             const objectId = typeof dataId === 'string' ? new ObjectId(dataId) : dataId;
    
//             // Delete document from DATA_COLLECTIONS based on _id
//             db.get().collection(collection.DATA_COLLECTIONS).deleteOne({ _id: objectId })
//                 .then(async (deleteResult) => {
//                     if (deleteResult.deletedCount > 0) {
//                         console.log(`Deleted document with _id ${dataId}`);
    
//                         // // Reduce rent if userpurpose is "Personal" or "Class"
//                         // if (data.userpurpose === "Personal" || data.userpurpose === "Class") {
//                         //     try {
//                         //         const userId = data.userId;
    
//                         //         // Try to find user data by userId (as string first)
//                         //         let userData = await db.get().collection(collection.DATABASE_COLLECTIONS).findOne({ userId: userId });
    
//                         //         // If not found, try userId as integer
//                         //         if (!userData) {
//                         //             const userIdInt = parseInt(userId);
//                         //             if (!isNaN(userIdInt)) {
//                         //                 userData = await db.get().collection(collection.DATABASE_COLLECTIONS).findOne({ userId: userIdInt });
//                         //             }
//                         //         }
    
//                         //         if (userData) {
//                         //             // Reduce rent by 5
//                         //             const reducedRent = (userData.rent || 0) - 5;
    
//                         //             // Update the rent in the database
//                         //             const updateResult = await db.get().collection(collection.DATABASE_COLLECTIONS).updateOne(
//                         //                 { _id: userData._id },
//                         //                 { $set: { rent: reducedRent } }
//                         //             );
    
//                         //             console.log(`Rent reduced by 5 for userId ${userId}: New rent is ${reducedRent}`);
//                         //             console.log("Update result:", updateResult);
//                         //         } else {
//                         //             console.log(`No user data found for userId ${userId}`);
//                         //         }
//                         //     } catch (error) {
//                         //         console.error("Error reducing rent:", error);
//                         //         reject(error);
//                         //     }
//                         // }
    
//                         resolve(deleteResult);
//                     // } else {
//                     //     console.log(`No document found with _id ${dataId}`);
//                     //     resolve(null); // Resolve with null if no document was deleted
//                     // }
//                 }
//                 // .catch((error) => {
//                 //     console.error("Error deleting document:", error);
//                 //     reject(error);
//                 });
//     })
// }
    // ,
    addDeposit: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Insert data into DATA_COLLECTIONS
                const response = await db.get().collection(collection.DEPOSIT_COLLECTIONS).insertOne(data);
                
                const userIdStr = data.userId;
                const userIdInt = parseInt(data.userId);
    
                // Attempt to find user data using userId as string
                let userData = await db.get().collection(collection.DATABASE_COLLECTIONS).findOne({ userId: userIdStr });
    
                // If not found, attempt to find user data using userId as integer
                if (!userData && !isNaN(userIdInt)) {
                    userData = await db.get().collection(collection.DATABASE_COLLECTIONS).findOne({ userId: userIdInt });
                }
    
                if (userData) {
                    // Convert deposit to integer (int32)
                    const updatedDeposit = parseInt(data.deposit);
                    const updateResult = await db.get().collection(collection.DATABASE_COLLECTIONS).updateOne(
                        { _id: userData._id },
                        { $set: { deposit: updatedDeposit } }
                    );
    
                    console.log(`Deposit updated for userId ${userData.userId}: New deposit is ${updatedDeposit}`);
                    console.log("Update result:", updateResult);
                } else {
                    // If no userData, initialize deposit with data.deposit
                    const initialDeposit = parseInt(data.deposit);
                    const newUserId = isNaN(userIdInt) ? userIdStr : userIdInt;
                    const insertResult = await db.get().collection(collection.DATABASE_COLLECTIONS).insertOne({
                        userId: newUserId,
                        deposit: initialDeposit
                    });
    
                    console.log(`Initialized deposit for userId ${newUserId} with ${initialDeposit} rupees`);
                }
                resolve(response);
            } catch (error) {
                console.error("Error updating/inserting deposit:", error);
                reject(error);
            }
        });
    },
    updateBalanceForAll: () => {
        return new Promise(async (resolve, reject) => {
          try {
            // Get all documents from the collection
            const allUsers = await db.get().collection(collection.DATABASE_COLLECTIONS).find({}).toArray();
      
            // Iterate through each document
            for (let user of allUsers) {
              // Calculate balance
              const rent = user.rent || 0; // If rent is not defined, set to 0
              const deposit = user.deposit || 0; // If deposit is not defined, set to 0
              const balance = rent - deposit;
      
              // Update the document with the balance
              await db.get().collection(collection.DATABASE_COLLECTIONS).updateOne(
                { _id: new ObjectID(user._id) }, // Ensure _id is converted to ObjectID
                { $set: { rent: rent, deposit: deposit, balance: balance } } // Ensure rent and deposit are set, along with balance
              );
      
            }
      
            console.log("All balances updated successfully");
            resolve("All balances updated successfully");
          } catch (error) {
            console.error("Error updating balances:", error);
            reject(error); // Reject with the error for proper error handling
          }
        });
      },
      updateRentBasedOnPurpose: () => {
        return new Promise(async (resolve, reject) => {
            try {
                // Check if the database is connected
                if (!db) {
                    throw new Error('Database connection not established');
                }
    
                console.log("Database connection established");
    
                // Aggregate data to calculate the sum of additional rent based on userpurpose entries for each userId
                const result = await db.get().collection(collection.DATA_COLLECTIONS).aggregate([
                    {
                        $match: {
                            userpurpose: { $in: ["Class", "Personal"] }
                        }
                    },
                    {
                        $group: {
                            _id: "$userId",
                            totalRentIncrement: { $sum: 5 } // Sum of rent increments for each matched userId
                        }
                    }
                ]).toArray();
    
                console.log("Aggregation result:", result);
    
                // Update rent for each userId based on the aggregation result
                for (let entry of result) {
                    const userId = entry._id;
                    const totalRentIncrement = entry.totalRentIncrement;
    
                    console.log(`Updating rent for userId: ${userId}, additionalRent: ${totalRentIncrement}`);
    
                    // Update the user's rent in the users collection
                    const updateResult = await db.get().collection(collection.DATABASE_COLLECTIONS).updateOne(
                        {
                            $or: [
                                { userId: userId },             // Match string userId
                                { userId: parseInt(userId) }    // Match integer userId
                            ]
                        },
                        { $inc: { rent: totalRentIncrement } }
                    );
    
                    if (updateResult.modifiedCount === 1) {
                        console.log(`Rent updated successfully for userId ${userId}`);
                    } else {
                        console.log(`No document found or updated for userId ${userId}`);
                    }
                }
    
                console.log("Rent updated based on userpurpose for all users.");
                resolve("Rent updated based on userpurpose for all users.");
            } catch (error) {
                console.error("Error updating rent based on userpurpose:", error);
                reject(error);
            }
        });
    },
    

     


}
      
      
      
    


