const { isValidObjectId } = require("mongoose")
const bookModel = require("../models/bookmodel")
const {isEmpty} = require("../validation/validation")


const createBook = async function (req, res) {
    try {
        let data = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, reviews } = data

        // IF BODY IS EMPTY.------------------------------------------
         if(Object.keys(data).length==0)
         return res.status(400).send({status:false, message:"Please provide data in request body"})
    

         // IF VALUES ARE NOT IN BODY.--------------------------------
         if(!title)
         return res.status(400).send({stauts:false, message:"title is required"})

         if(!excerpt)
         return res.status(400).send({stauts:false, message:"excerpt is required"})

         if(!userId)
         return res.status(400).send({stauts:false, message:"userId is required"})

         if(!ISBN)
         return res.status(400).send({stauts:false, message:"ISBN is required"})

         if(!category)
         return res.status(400).send({stauts:false, message:"category is required"})

         if(!subcategory)
         return res.status(400).send({stauts:false, message:"subcategory is required"})

        

         // IF VALUES ARE EMPTY BY INFO.-------------------------------------
         if(!(isEmpty(title)))
         return res.status(400).send({stauts:false, message:"title is empty"})

         if(!(isEmpty(excerpt)))
         return res.status(400).send({stauts:false, message:"excerpt is empty"})

         if(!(isEmpty(ISBN)))
         return res.status(400).send({stauts:false, message:"ISBN is empty"})

         if(!(isEmpty(userId)))
         return res.status(400).send({stauts:false, message:"userId is empty"})

         if(!isValidObjectId(userId))
         return res.status(400).send({stauts:false, message:"userId is invalid"})

         if(!(isEmpty(category)))
         return res.status(400).send({stauts:false, message:"category is empty"})

         if(!(isEmpty(subcategory)))
         return res.status(400).send({stauts:false, message:"subcategory is empty"})
     
        const findbook = await bookModel.findOne({title:data.title})
        if(findbook)
        return res.status(400).send({status:false,message:"Title is registered please pass new title"})

        const findISBN = await bookModel.findOne({ISBN:data.ISBN})
        if(findISBN)
        return res.status(400).send({status:false,message:"ISBN is registered please pass new ISBN"})

        const createdBook = await bookModel.create(data)
        return res.status(201).send({ status: true, message: "Book created Successfully", data: createdBook })

    }
        catch (err) {
            return res.status(500).send({ status: false, message: err.message })
        }
}

    

const allBooks = async function (req, res) {

    try {

        const { userId, category, subcategory } = req.query;

        let findObj = {
            isDeleted: false,
        }
        if (userId) {
            findObj["userId"] = userId
        }
        if (category) {
            findObj["category"] = category
        }
        if (subcategory) {
            findObj["subcategory"] = subcategory
        }
        
        let data = await bookModel.find(findObj).select({ _id: 1, title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1 });
        
       if (data.reviews > 0) {
        data.reviewsData = data.reviews;
       }

        if (data.length <= 0) return res.status(404).send({ Status: false, message: 'No Data Found' })

        res.status(200).send({ Status: true, message: "Book List", data: data })

    }   catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = {allBooks , createBook};


