// The links as data: every section once, then each page as a list of section keys, in order.
// A section can be on several pages (most are on everybody's). A section without a title is
// always open; one with a title can be collapsed, and `collapsed` makes it start closed.
// `image` is a path under images/ (or a full URL), `style` an optional class such as "br-20".
//
// Since the links moved into Supabase this file is the starting data (tools/make-seed.mjs turns
// it into SQL) and what the page shows in test mode (see store.js). Change links in the database,
// through the admin panel at /claudiu, not here.

export const sections = {
	"luke-top": {
		title: null,
		links: [
			{ title: "Luke's IXL Assignment", url: "https://www.ixl.com/social-studies/grade-4/the-civil-war-war-tactics-and-the-home-front", image: "homeschooling/the-civil-war-war-tactics-and-the-home-front.png", style: "br-10" },
			{ title: "Luke Daily Bancos", url: "https://daily-bancos.vercel.app/write/luke-bfbcdfbccbb84227", image: "LukeTypingBulbasaur.png", style: "br-20" },
		],
	},
	"nathan-top": {
		title: null,
		links: [
			{ title: "Nathan's IXL Assignment", url: "https://www.ixl.com/social-studies/grade-1/paul-revere", image: "homeschooling/paul-revere.png", style: "br-10" },
			{ title: "Nathan Daily Bancos", url: "https://daily-bancos.vercel.app/write/nathan-c0a33f68a26041a5", image: "NathanTypingMudkip.png", style: "br-20" },
		],
	},
	"science": {
		title: null,
		links: [
			{ title: "Third Grade Science", url: "https://www.ixl.com/science/grade-3", image: "homeschooling/third-grade-science.png" },
			{ title: "Fourth Grade Science", url: "https://www.ixl.com/science/grade-4", image: "homeschooling/fourth-grade-science.png" },
		],
	},
	"family-games": {
		title: null,
		links: [
			{ title: "Super Pokemon World", url: "https://super-pokemon-world.netlify.app/", image: "SuperPokemonWorld.png", style: "br-20" },
			{ title: "Pokemon TCG Retro", url: "https://pokemon-tcg-retro.netlify.app/", image: "PokemonTCGRetro.webp", style: "br-20" },
			{ title: "Pokemon Uno", url: "https://pokemon-uno.netlify.app/", image: "PokemonUno.webp", style: "br-20" },
			{ title: "Frozen Assets", url: "https://celestebancos.github.io/frozen-assets/", image: "FrozenAssets.png" },
			{ title: "Nathan's Tixy", url: "https://celestebancos.github.io/tixy-quest/", image: "nathan_tixy.png", style: "br-20" },
			{ title: "Lode Runner Web Game", url: "https://loderunnerwebgame.netlify.app/", image: "LodeRunner.png" },
		],
	},
	"tools": {
		title: "Tools",
		links: [
			{ title: "Chrome Music Lab", url: "https://musiclab.chromeexperiments.com/", image: "ChromeMusicLab.png" },
			{ title: "Google Drive", url: "https://drive.google.com/", image: "homeschooling/google_drive.png" },
			{ title: "Google Chat", url: "https://mail.google.com/", image: "GoogleChat.png" },
			{ title: "Google Maps", url: "https://maps.google.com/", image: "GoogleMaps.png", style: "br-20" },
			{ title: "Google Earth", url: "https://earth.google.com/", image: "GoogleEarth.png", style: "br-20" },
		],
	},
	"chess": {
		title: "Chess",
		links: [
			{ title: "Lichess", url: "https://lichess.org/", image: "Lichess.png" },
			{ title: "ChessKid", url: "https://www.chesskid.com/", image: "ChessKid.png", style: "br-20" },
			{ title: "Chess.com", url: "https://www.chess.com/", image: "chessDotCom.png", style: "br-20" },
		],
	},
	"typing": {
		title: "Typing",
		links: [
			{ title: "Typing", url: "https://www.typing.com/student/lessons", image: "homeschooling/typing.svg" },
			{ title: "TypeTastic!", url: "https://typetastic.com/learn.html", image: "TypeTastic.png", style: "br-20" },
			{ title: "Mario Teaches Typing", url: "https://playclassic.games/games/educational-dos-games-online/play-mario-teaches-typing-online/play/", image: "MarioTeachesTyping.png", style: "br-10" },
		],
	},
	"misc-learning": {
		title: "Misc. Learning Stuff",
		links: [
			{ title: "Neighborhood Good", url: "https://ed.icivics.org/node/1814/resource", image: "NeighborhoodGood.png" },
			{ title: "Internal Combustion Engine", url: "https://ciechanow.ski/internal-combustion-engine/", image: "InternalCombustionEngine.png" },
			{ title: "Regular Tixy", url: "https://www.mathsuniverse.com/tixy/", image: "tixy.png", style: "br-20" },
			{ title: "MolView", url: "https://app.molview.com/", image: "MolView.png" },
		],
	},
	"learning-games": {
		title: "Learning Games",
		links: [
			{ title: "Custom Wordle", url: "https://mywordle.strivemath.com/", image: "CustomWordle.png" },
			{ title: "Wordle", url: "https://www.nytimes.com/games/wordle/index.html", image: "Wordle.png" },
			{ title: "Hello Wordl", url: "https://hellowordl.net/", image: "HelloWordl.png" },
			{ title: "Nonograms", url: "https://www.goobix.com/games/nonograms/", image: "Nonograms.png" },
		],
	},
	"entertaining-games": {
		title: "Entertaining Games",
		links: [
			{ title: "Minecraft Classic", url: "https://classic.minecraft.net/", image: "MinecraftClassic.jfif" },
			{ title: "Cut The Rope", url: "https://www.crazygames.com/game/cut-the-rope-ebx/", image: "CutTheRope.png" },
			{ title: "Snake Game", url: "https://googlesnakemods.com/v/current/", image: "SnakeGame.png" },
		],
	},
	"math": {
		title: "Math Stuff",
		links: [
			{ title: "Kindergarten Math", url: "https://www.ixl.com/math/kindergarten", image: "KindergartenMath.png" },
			{ title: "Money Drag", url: "https://teacher.gynzy.com/en-us/board?content=745", image: "homeschooling/money-drag.png" },
		],
	},
	"reading": {
		title: "Reading Stuff",
		links: [
			{ title: "Minecraft Library Books", url: "https://docs.google.com/spreadsheets/d/1S8DT6gFK6Se2LPJyFh8o9837mNv8ZXBWYFEJUblUcZU/edit", image: "MinecraftBooks.png" },
			{ title: "Wordville", url: "https://wordville.com/", image: "Wordville.png", style: "br-20" },
			{ title: "Grammar Tools", url: "https://jwed.co.uk/tools/", image: "GrammarTools.png" },
			{ title: "Teach Your Monster to Read", url: "https://www.teachyourmonster.org/u/21640347", image: "monster.png" },
			{ title: "Letter Sounds", url: "https://phonicsandstuff.com/phonemes", image: "LetterSounds.png" },
			{ title: "Morpheme Mix", url: "https://phonicsandstuff.com/puzzles/morpheme-mix/", image: "MorphemeMix.png" },
			{ title: "EdShed Letter Tiles", url: "https://www.edshed.com/en-us/lettertiles", image: "LetterTiles.png" },
		],
	},
	"ixl-math-games": {
		title: "IXL Math Games",
		links: [
			{ title: "One Hundred Snowballs", url: "https://www.ixl.com/games/one_hundred_snowballs", image: "OneHundredSnowballs.png", style: "br-10" },
			{ title: "Birthday Candle Counting", url: "https://www.ixl.com/games/birthday-candle-counting", image: "BirthdayCandleCounting.png", style: "br-10" },
			{ title: "Count Snakes", url: "https://www.ixl.com/games/base-ten-fun-count-write-ones-a", image: "CountSnakes.png", style: "br-10" },
			{ title: "Counting Blocks Bingo", url: "https://www.ixl.com/games/counting-blocks-bingo-ones-a", image: "CountingBlocksBingo.png", style: "br-5" },
			{ title: "Counting Fish", url: "https://www.ixl.com/games/counting_fish", image: "CountingFish.png", style: "br-5" },
			{ title: "Fuzz Bugs: Counting, Sorting, Comparing", url: "https://www.ixl.com/games/counting_sorting_comparing", image: "FuzzBugsCountingSortingComparing.png", style: "br-5" },
			{ title: "Fuzz Bugs: Patterns", url: "https://www.ixl.com/games/fuzz_bugs_patterns", image: "FuzzBugsPatterns.png", style: "br-5" },
			{ title: "Monster Mansion: Number Match", url: "https://www.ixl.com/games/monster-mansion-numbers-show-a", image: "MonsterMansionNumberMatch.png", style: "br-5" },
			{ title: "Monster Mansion: Number Memory Match", url: "https://www.ixl.com/games/monster-mansion-numbers-memory-a", image: "MonsterMansionNumberMemoryMatch.png", style: "br-5" },
			{ title: "Number Bingo: 0 to 10", url: "https://www.ixl.com/games/number-bingo-10-a", image: "NumberBingo0To10.png", style: "br-5" },
			{ title: "Number Bingo: 0 to 20", url: "https://www.ixl.com/games/number-bingo-20-a", image: "NumberBingo0To20.png", style: "br-5" },
			{ title: "Math Man: Addition", url: "https://www.ixl.com/games/math-man-addition-a", image: "MathManAddition.jpg", style: "br-5" },
		],
	},
	"ixl-english-games": {
		title: "IXL English Games",
		links: [
			{ title: "Sight Word Bingo", url: "https://www.ixl.com/games/sight-word-bingo-pre-primer-a", image: "SightWordBingo.png", style: "br-5" },
			{ title: "Alphabet Bingo: Uppercase Letters", url: "https://www.ixl.com/games/alphabet-bingo-names-uppercase-a", image: "AlphabetBingoUppercaseLetters.png", style: "br-5" },
		],
	},
};

const everybody = ["family-games", "tools", "chess", "typing", "misc-learning", "learning-games", "entertaining-games", "math", "reading", "ixl-math-games", "ixl-english-games"];

// `slug` is the address (/luke); "home" is the page at / for when nobody is signed in.
// `name` labels it in the admin's list of pages; `owner` is the account's display name; the owner of an `admin` page can see and edit every page.
export const pages = [
	{ slug: "home", name: "Home", title: "Bancos Kids' Links", owner: null, sections: ["science", ...everybody] },
	{ slug: "luke", name: "Luke", title: "Luke's Links", owner: "Luke", sections: ["luke-top", "science", ...everybody] },
	{ slug: "nathan", name: "Nathan", title: "Nathan's Links", owner: "Nathan", sections: ["nathan-top", ...everybody] },
	{ slug: "daniel", name: "Daniel", title: "Daniel's Links", owner: "Daniel", sections: everybody },
	{ slug: "claudiu", name: "Claudiu", title: "Claudiu's Links", owner: "Claudiu", admin: true, sections: ["tools"] },
];
