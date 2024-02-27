import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    player_id: String,
    substitute: Boolean,
    out: Boolean,
    in: Boolean,
    role_str: String,
    role: String,
    playing11: Boolean,
    name: String
});

const scoreboardPlayerSchema = new mongoose.Schema({
    name: String,
    batsman_id: String,
    batting: Boolean,
    position: String,
    role: String,
    role_str: String,
    runs: Number,
    balls_faced: Number,
    fours: Number,
    sixes: Number,
    run0: Number,
    how_out: String,
    dismissal: String,
    strike_rate: String,
    bowler_id: String,
    first_fielder_id: String,
    second_fielder_id: String,
    third_fielder_id: String
});

const fielderSchema = new mongoose.Schema({
    fielder_id: String,
    fielder_name: String,
    catches: Number,
    stumping: Number,
    is_substitute: Boolean
});

const bowlerSchema = new mongoose.Schema({
    name: String,
    bowler_id: String,
    bowling: Boolean,
    position: String,
    overs: Number,
    maidens: Number,
    runs_conceded: Number,
    wickets: Number,
    noballs: Number,
    wides: Number,
    econ: String,
    run0: Number
});

const partnershipSchema = new mongoose.Schema({
    runs: Number,
    balls: Number,
    overs: Number,
    batsmen: [{
        name: String,
        batsman_id: String,
        runs: Number,
        balls: Number
    }]
});

const fowSchema = new mongoose.Schema({
    name: String,
    batsman_id: String,
    runs: Number,
    balls: Number,
    how_out: String,
    score_at_dismissal: Number,
    overs_at_dismissal: String,
    bowler_id: String,
    dismissal: String,
    number: Number
});

const inningsSchema = new mongoose.Schema({
    iid: Number,
    number: Number,
    name: String,
    short_name: String,
    status: Number,
    issuperover: Boolean,
    result: Number,
    batting_team_id: Number,
    fielding_team_id: Number,
    scores: String,
    scores_full: String,
    batsmen: [scoreboardPlayerSchema],
    bowlers: [bowlerSchema],
    fielder: [fielderSchema],
    powerplay: {
        p1: {
            startover: String,
            endover: String
        }
    },
    fows: [fowSchema],
    last_wicket: fowSchema,
    extra_runs: {
        byes: Number,
        legbyes: Number,
        wides: Number,
        noballs: Number,
        penalty: String,
        total: Number
    },
    equations: {
        runs: Number,
        wickets: Number,
        overs: String,
        bowlers_used: Number,
        runrate: String
    },
    current_partnership: partnershipSchema,
    did_not_bat: [String],
    max_over: String
});

const livePlayerSchema = new mongoose.Schema({
    playerName: String,
    playerId: String,
    runs: Number,
    ballsFaced: Number,
    fours: Number,
    sixes: Number,
    strikeRate: String
});

const liveBowlerSchema = new mongoose.Schema({
    bowlerName: String,
    bowlerId: String,
    overs: Number,
    runsConceded: Number,
    wickets: Number,
    maidens: Number,
    economy: String
});

const liveFielderSchema = new mongoose.Schema({
    fielderId: String,
    fielderName: String,
    catches: Number,
    stumping: Number,
    isSubstitute: Boolean
});

const commentarySchema = new mongoose.Schema({
    eventType: String,
    over: Number,
    runs: Number,
    score: String,
    bats: [{
        runs: Number,
        ballsFaced: Number,
        fours: Number,
        sixes: Number,
        batsmanId: String
    }],
    bowls: [{
        runsConceded: Number,
        maidens: Number,
        wickets: Number,
        bowlerId: String,
        overs: Number
    }],
    commentary: String
});

const livePartnershipSchema = new mongoose.Schema({
    runs: Number,
    balls: Number,
    overs: Number,
    batsmen: [{
        name: String,
        playerId: String,
        runs: Number,
        balls: Number
    }]
});

const lastWicketSchema = new mongoose.Schema({
    name: String,
    playerId: String,
    runs: String,
    balls: String,
    howOut: String,
    scoreAtDismissal: Number,
    oversAtDismissal: String,
    bowlerId: String,
    dismissal: String,
    number: Number
});

const liveInningSchema = new mongoose.Schema({
    inningId: Number,
    inningNumber: Number,
    name: String,
    shortName: String,
    status: Number,
    isSuperOver: Boolean,
    result: Number,
    battingTeamId: Number,
    fieldingTeamId: Number,
    scores: String,
    scoresFull: String,
    fielder: [liveFielderSchema],
    powerPlay: {
        phase1: {
            startOver: String,
            endOver: String
        }
    },
    lastWicket: lastWicketSchema,
    extraRuns: {
        byes: Number,
        legByes: Number,
        wides: Number,
        noBalls: Number,
        penalty: String,
        total: Number
    },
    equations: {
        runs: Number,
        wickets: Number,
        overs: String,
        bowlersUsed: Number,
        runRate: String
    },
    currentPartnership: livePartnershipSchema,
    didNotBat: [String],
    maxOver: String,
    recentScores: String,
    lastFiveOvers: String,
    lastTenOvers: String
});

const playerInfoSchema = new mongoose.Schema({
    pid: {
        type: Number,
        // required: true
    },
    title: {
        type: String,
        // required: true
    },
    short_name: {
        type: String,
        // required: true
    },
    first_name: {
        type: String,
        // required: true
    },
    last_name: String,
    middle_name: String,
    birthdate: {
        type: Date,
        // required: true
    },
    birthplace: {
        type: String,
        // required: true
    },
    country: {
        type: String,
        // required: true
    },
    logo_url: String,
    playing_role: {
        type: String,
        // required: true
    },
    batting_style: {
        type: String,
        // required: true
    },
    bowling_style: String,
    fielding_position: String,
    facebook_profile: String,
    twitter_profile: String,
    instagram_profile: String,
    nationality: {
        type: String,
        // required: true
    }
});


// Schema to export
const MatchInfo = new mongoose.Schema({
    match_id: Number,
    match_info: {
        match_id: Number,
        title: String,
        short_title: String,
        subtitle: String,
        match_number: String,
        format: Number,
        format_str: String,
        status: Number,
        status_str: String,
        status_note: String,
        game_state: Number,
        game_state_str: String,
        domestic: String,
        competition: {
            cid: { type: Number, require: true },
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
            team_id: Number,
            name: String,
            short_name: String,
            logo_url: String,
            thumb_url: String,
            scores_full: String,
            scores: String,
            overs: String
        },
        teamb: {
            team_id: Number,
            name: String,
            short_name: String,
            logo_url: String,
            thumb_url: String,
            scores_full: String,
            scores: String,
            overs: String
        },
        date_start: Date,
        date_end: Date,
        timestamp_start: Number,
        timestamp_end: Number,
        date_start_ist: String,
        date_end_ist: String,
        venue: {
            venue_id: String,
            name: String,
            location: String,
            country: String,
            timezone: String
        },
        umpires: String,
        referee: String,
        equation: String,
        live: String,
        result: String,
        result_type: Number,
        win_margin: String,
        winning_team_id: Number,
        commentary: Number,
        wagon: Number,
        latest_inning_number: Number,
        oddstype: String,
        toss: {
            text: String,
            winner: Number,
            decision: Number
        }
    },
    match_playing11: {
        teama: {
            team_id: Number,
            squads: [playerSchema]
        },
        teamb: {
            team_id: Number,
            squads: [playerSchema]
        }
    },
    man_of_the_match: {
        pid: String,
        name: String,
        thumb_url: String
    },
    man_of_the_series: [String],
    scorecard: {
        innings: [inningsSchema],
        is_followon: Number,
        day_remaining_over: String
    },
    live: {
        matchId: Number,
        status: Number,
        statusString: String,
        gameState: Number,
        gameStateString: String,
        statusNote: String,
        teamBatting: String,
        teamBowling: String,
        liveInningNumber: Number,
        liveScore: {
            runs: Number,
            overs: Number,
            wickets: Number,
            target: Number,
            runRate: Number,
            requiredRunRate: String
        },
        batsmen: [livePlayerSchema],
        bowlers: [liveBowlerSchema],
        commentaries: [commentarySchema],
        liveInning: liveInningSchema
    },
    live_odds: [],
    session_odds: [],
    player: [playerInfoSchema]
});

const Match_Info = mongoose.model('match_info', MatchInfo);

export default Match_Info;