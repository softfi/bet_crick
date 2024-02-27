import mongoose from 'mongoose';

const MatchList = new mongoose.Schema({
    match_id: { type: Number, required: true },
    title: { type: String },
    short_title: { type: String },
    subtitle: { type: String },
    match_number: { type: String },
    format: { type: Number },
    format_str: { type: String },
    status: { type: Number },
    status_str: { type: String },
    status_note: { type: String },
    game_state: { type: Number },
    game_state_str: { type: String },
    domestic: { type: String },
    competition: {
        cid: { type: Number },
        title: { type: String },
        abbr: { type: String },
        type: { type: String },
        category: { type: String },
        match_format: { type: String },
        season: { type: String },
        status: { type: String },
        datestart: { type: String },
        dateend: { type: String },
        country: { type: String },
        total_matches: { type: String },
        total_rounds: { type: String },
        total_teams: { type: String }
    },
    teama: {
        team_id: { type: Number },
        name: { type: String },
        short_name: { type: String },
        logo_url: { type: String },
        scores_full: { type: String },
        scores: { type: String },
        overs: { type: String }
    },
    teamb: {
        team_id: { type: Number },
        name: { type: String },
        short_name: { type: String },
        logo_url: { type: String },
        scores_full: { type: String },
        scores: { type: String },
        overs: { type: String }
    },
    date_start: { type: Date },
    date_end: { type: Date },
    timestamp_start: { type: Number },
    timestamp_end: { type: Number },
    date_start_ist: { type: String },
    date_end_ist: { type: String },
    venue: {
        venue_id: { type: String },
        name: { type: String },
        location: { type: String },
        country: { type: String },
        timezone: { type: String }
    },
    umpires: { type: String },
    referee: { type: String },
    equation: { type: String },
    live: { type: String },
    result: { type: String },
    result_type: { type: Number },
    win_margin: { type: String },
    winning_team_id: { type: Number },
    commentary: { type: Number },
    wagon: { type: Number },
    latest_inning_number: { type: Number },
    weather: { type: Array },
    pitch: {
        pitch_condition: { type: String },
        batting_condition: { type: String },
        pace_bowling_condition: { type: String },
        spine_bowling_condition: { type: String }
    },
    toss: {
        text: { type: String },
        winner: { type: Number },
        decision: { type: Number }
    }
});

const Match_List = mongoose.model('match_list', MatchList);

export default Match_List;
