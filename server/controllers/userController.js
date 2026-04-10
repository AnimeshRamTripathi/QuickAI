import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
  try {
    // Get userId from auth middleware (e.g., Clerk)
    const { userId } = req.auth();

    // Fetch creations for the logged-in user
    const creations = await sql`
      SELECT * FROM creations
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    // Send response
    res.json({
      success: true,
      creations,
    });

  } catch (error) {
    console.error("Error fetching user creations:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
}; 
export const getPublishedCreations = async (req, res) => {
  try {
   

    // Fetch creations for the logged-in user
    const creations = await sql`
      SELECT * FROM creations
      WHERE publish=true
      ORDER BY created_at DESC
    `;

    // Send response
    res.json({
      success: true,
      creations,
    });

  } catch (error) {
    console.error("Error fetching user creations:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
}; 
export const toggleLikeCreation = async (req, res) => {
  try {
   
    const { userId } = req.auth();
    const {id}=req.body

    const [creation]=await sql`SELECT * FROM creations WHERE id =${id}`

    // Fetch creations for the logged-in user
   if(!creation)
   return res.json({success:false,message:"Creation not found"})
  
    const currentLikes=creation.likes;
    const userIdStr=userId.toString();
    let updatedLikes;
    let message;

    if(currentLikes.includes(userIdStr))
       { updatedLikes=currentLikes.filter((user)=>user!==userIdStr);
        message='Creation Unliked'
}
else
{
    updatedLikes=[...currentLikes,userIdStr]
    message='Creation Liked'
}
const formattedArray = `{${updatedLikes.join(',')}}`

await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

    // Send response
    res.json({
      success: true,
      creation,
      message
    });

    

  } catch (error) {
    console.error("Error fetching user creations:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
}; 