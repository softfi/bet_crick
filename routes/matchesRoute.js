import express from "express";
import morgan from "morgan";
import { body, validationResult } from "express-validator";
import { listMatches, getMatchInfo } from "../controllers/entity/matchController.js";
export const dataRoute = express.Router();

dataRoute.get('/match-list', listMatches);

dataRoute.get('/match-info/:matchId', getMatchInfo);