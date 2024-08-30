import express from "express";
import morgan from "morgan";
import { body, validationResult } from "express-validator";
import { listMatches, matchesOfApi } from "../controllers/entity/matchController.js";
export const dataRoute = express.Router();

dataRoute.get('/match-list', listMatches);

// dataRoute.get('/match-info/:matchId', getMatchInfo);
// dataRoute.get('/match-info/odd/:matchId', getMatchInfoWithOdd)
// dataRoute.get('/match-info/bookmarker/:matchId', getMatchInfoWithOdd)

dataRoute.get('/match-api/:type/:matchId', matchesOfApi)