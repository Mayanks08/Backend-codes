import mongoose from "mongoose";
import { Video } from "../models/Video.models.js";
import { Subscription } from "../models/SubscriptionModel.js";
import { Like } from "../models/LikeModels.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/TweetModel.js";
import { Comment } from "../models/CommentsModel.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const userId = req.user._id;

  const totalVideos = await Video.countDocuments({
    owner: userId,
  });

  if (!totalVideos === null || totalVideos === undefined) {
    throw new ApiError(
      500,
      "Something went wrong while displaying total videos"
    );
  }

  const totalSubscribers = await Subscription.countDocuments({
    channel: userId,
  });

  if (!totalSubscriber === null || totalSubscribers === undefined) {
    throw new ApiError(
      500,
      "Something went wrong while displaying total subscribers"
    );
  }

  const totalLikes = await Like.countDocuments({
    video: {
      $in: await Video.find({ owner: userId }).distinct("_id"),
    },
  });

  if (!totalLikes === null || totalVideoLikes === undefined) {
    throw new ApiError(
      500,
      "Something went wrong while displaying total likes"
    );
  }
  
  const totalVideoLikes = await Like.countDocuments({
    video: {
      $in: await Video.find({ owner: userId }).distinct("_id"),
    },
  });

  if (totalVideoLikes === null || totalVideoLikes === undefined) {
    throw new ApiError(
      500,
      "Something went wrong while displaying total likes"
    );
  }

  const totalTweetLikes = await Like.countDocuments({
    tweet: {
      $in: await Tweet.find({ owner: userId }).distinct("_id"),
    },
  });

  if (totalTweetLikes === null || totalTweetLikes === undefined) {
    throw new ApiError(
      500,
      "Something went wrong while displaying total tweet likes"
    );
  }

  const totalCommentLikes = await Like.countDocuments({
    comment: {
      $in: await Comment.find({ owner: userId }).distinct("_id"),
    },
  });

  if (totalCommentLikes === null || totalCommentLikes === undefined) {
    throw new ApiError(
      500,
      "Something went wrong while displaying total comment likes"
    );
  }

  const totalViews = await Video.aggregate([
    {
      $match: {
        owner: userId,
      },
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" },
      },
    },
  ]);

  if (!totalViews === null || totalViews === undefined) {
    throw new ApiError(
      500,
      "Something went wrong while displaying total views"
    );
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos,
        totalSubscribers,
        totalLikes,
        totalVideoLikes,
        totalTweetLikes,
        totalCommentLikes,
        totalViews: totalViews[0]?.totalViews || 0,
      },
      "Channel stats fetched successfully"
    )
  );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel

  const userId = req.user._id;

  const videos = await Video.find({
    owner: userId,
  }).sort({
    createdAt: -1,
  });

  if (!videos) {
    throw new ApiError(404, "Videos not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };