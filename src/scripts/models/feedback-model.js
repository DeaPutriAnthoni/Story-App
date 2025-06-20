import FeedbackDB from '../local-db/feedback-db';

const FeedbackModel = {
  async addFeedback(storyId, feedback) {
    if (!feedback || feedback.trim() === '') return;
    return FeedbackDB.put(storyId, feedback);
  },

  async getFeedbacks(storyId) {
    const entry = await FeedbackDB.get(storyId);
    return entry ? entry.feedbacks : [];
  },
};

export default FeedbackModel;