const UserModel = require("./../models/user-model");
const TagModel = require("./../models/tag-model");
const errorCreator = require("../utils/error-creator");

exports.getTags = async (req, res, next) => {
  const userId = req.userId;
  const { active: getActiveTags } = req.query;
  try {
    let tagQuery = TagModel.find({
      user: userId,
    });
    // If only activeTags are required, then filter the inactive tags
    if (getActiveTags) tagQuery = tagQuery.where("active").equals(true);
    const userTags = await tagQuery;
    return res.status(200).json({
      status: "success",
      tags: userTags,
    });
  } catch (err) {
    console.log("An error occurred while fetching the user tags");
    throw err;
  }
};

exports.postCreateTag = async (req, res, next) => {
  const userId = req.userId;
  const { name: tagName } = req.body;
  const newTag = new TagModel({
    name: tagName,
    user: userId,
  });
  let createdTag;
  // Create a new tag
  try {
    createdTag = await newTag.save();
  } catch (err) {
    console.log("An error occurred while creating a new tag");
    throw err;
  }
  // Attach the created tag to the user
  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: { tags: createdTag },
      },
      { returnDocument: "after" },
    );
    // Return the newly created tag
    return res.status(201).json({
      status: "success",
      tag: createdTag,
    });
  } catch (err) {
    console.log("An error occurred while attaching the created tag to the user");
    // Remove the created tag from the db
    await TagModel.findByIdAndDelete(createdTag._id);
    throw err;
  }
};

exports.putUpdateTag = async (req, res, next) => {
  const userId = req.userId;
  const { tagId } = req.params;
  const validProperties = ["name", "active"];
  const dataToUpdate = req.body;
  // filter unnecessary fields
  Object.keys(dataToUpdate).forEach((key) => !validProperties.includes(key) && delete dataToUpdate[key]);

  try {
    const updatedTag = await TagModel.findByIdAndUpdate(tagId, dataToUpdate, { returnDocument: "after" });
    if (!updatedTag) {
      return next(errorCreator(`No tag with id=${tagId} exists for the user`, 404));
    }
    return res.status(200).json({
      status: "success",
      tag: updatedTag,
    });
  } catch (err) {
    console.log("An error occurred while updating tags");
    console.log(err);
  }
};
