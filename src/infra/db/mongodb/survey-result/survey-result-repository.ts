import { MongoHelper } from "../mongo-helpers";
import { SaveSurveyResultRepository } from "../../../../data/protocols/db/db-survey-result/save-survey-result-repository";
import { SurveyResultModel } from "../../../../domain/models/survey-result-model";
import { AddSurveyResultModel } from "../../../../domain/usecases/save-survey-result";

export class SurveyResultRepository implements SaveSurveyResultRepository {
  
  async saveResult(data: AddSurveyResultModel): Promise<SurveyResultModel> {
    const { accountId, surveyId, answer, date } = data;
    const collection = MongoHelper.getCollection('survey-result');
    const { insertedId } = await collection.insertOne({
      accountId,
      surveyId: MongoHelper.makeObjectId(surveyId), 
      answer, 
      date
    }); 
    const result = await collection.findOne({_id: insertedId})
    return result && MongoHelper.map(result);  
  }

  private async loadSurveyResult (id: string): Promise<any> {
    const surveyResultCollection = MongoHelper.getCollection("survey-result");
    const surveyResult = surveyResultCollection.aggregate([
      {
          $match: {surveyId: MongoHelper.makeObjectId(id)}
      }, 
      {
          $group: {
              _id: 0,
              data: {
                  $push: '$$ROOT'
              },
              totalAnswers: {
                  $sum: 1
              }
          }
      },
      {
          $unwind: {
              path: "$data"
          }
      },
      {
          $lookup: {
              from: 'surveys',
              foreignField: '_id',
              localField: 'data.surveyId',
              as: 'survey'   
          }
      },
      {
          $unwind: {
              path: '$survey'
          }
      }, 
      {
          $group: {
              _id: {
                  surveyId: '$survey._id',
                  totalSurveyAnswers: '$totalAnswers',
                  question: '$survey.question',
                  answer: '$data.answer',
                  answers: '$survey.answers', 
                  date: '$survey.date'
              },
              totalAnswer: {
                  $sum: 1
              }
          }
      },
      {
          $project: {
              _id: 0,
              surveyId: '$_id.surveyId',
              date: '$_id.date',
              question: '$_id.question',
              answer: '$_id.answer',
              answers: {
                  $map: {
                      input: '$_id.answers',
                      as: 'item',
                      in: {
                          $mergeObjects: ['$$item', {
                              count: { $cond: {
                                      if: { $eq: ['$$item.answer', '$_id.answer']},
                                      then: '$totalAnswer',
                                      else: 0
                                  }
                              },
                              percent: { $cond: 
                                  { 
                                      if: { $eq: ['$$item.answer', '$_id.answer']},
                                      then: { $multiply: [ { $divide: ['$totalAnswer', '$_id.totalSurveyAnswers'] }, 100 ] }, 
                                      else: 0 
                                  }
                              }
                          }]
                      }
                  }
              }
              
          }
      }, 
      {
          $group: {
              _id: {
                  surveyId: '$surveyId',
                  question: '$question',
                  date: '$date'
              },
              answers: {
                  $push: '$answers'
              }
        }             
    }, 
    {
        $project: {
            _id : 0,
            surveyId: '$_id.surveyId',
            question: '$_id.question',
            date: '$_id.date',
            answers: {
                $reduce: {
                    input: '$answers',
                    initialValue: [],
                    in: {
                        $concatArrays: ['$$value', '$$this']
                    }
                }
            }
        }
    },
    {
        $unwind: {
            path: '$answers'
        }
    },
    {
        $group: {
            _id: {
                surveyId: '$surveyId',
                question: '$question',
                date: '$date',
                answer: '$answers.answer',
                image: '$answers.image'   
            },
            count: {
                $sum: '$answers.count'
            },
            percent: {
                $sum: '$answers.percent'
            }           
        }
    },
    {
        $project: {
            _id: 0,
            surveyId: '$_id.surveyId',
            question: '$_id.question',
            date: '$_id.date',
            answers: {
                answer: '$_id.answer',
                image: '$_id.image',
                count: '$count',
                percent: '$percent'
            }   
        }
    },
    {
        $sort: {
            'answers.percent': -1
        }
    },
    {
        $group: {
            _id: {
                surveyId: '$surveyId',
                question: '$question',
                date: '$date',               
            },
            answers: {
                $push: '$answers'
            }
        }
    },
    {
        $project: {
            _id: 0,
            surveyId: {
                $toString: '$_id.surveyId'
            },
            question: '$_id.question',
            date: '$_id.date',
            answers: '$answers'           
        }
    }
  ]);

    return surveyResult
  
  }
}