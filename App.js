import { h } from "https://unpkg.com/preact?module";
import htm from "https://unpkg.com/htm?module";
import { Link } from "./components/Link.js";
import Section from "./components/Section.js";

const html = htm.bind(h);

// <${Link} title="" url="" image=".png"/>
// <${Link} title="" url="" image=".png" style=""/>

export default function App() {
	return html`
		<h1>Links for Luke and Nathan</h1>
		<${Section} noBorder>

			<${Link} title="Daniel's IXL Assignment" 
				url="https://www.ixl.com/math/pre-k/count-pictures-up-to-3" 
				image="homeschooling/daniel-homeschooling-rainbow.png" style="br-10"/>
			
			<${Link} title="Luke's IXL Assignment" 
				url="https://www.ixl.com/social-studies/grade-3/sitting-bull" 
				image="homeschooling/sitting-bull.png" style="br-10"/>
			
			<${Link} title="Nathan's IXL Assignment" 
				url="https://www.ixl.com/science/grade-2/changes-to-earths-surface-erosion" 
				image="homeschooling/changes-to-earths-surface-erosion.png" 
				style="br-10"/>
			
				<${Link} title="Typing" url="https://www.typing.com/student/lessons" image="homeschooling/typing.svg"/>
		<//>
		<${Section}>
			
			<${Link} title="Second Grade Science" url="https://www.ixl.com/science/grade-2" image="homeschooling/second-grade-science.png"/>
			<${Link} title="Fourth Grade Science" url="https://www.ixl.com/science/grade-4" image="homeschooling/fourth-grade-science.png"/>
		<//>
		<${Section}>
			<${Link} title="Teach Your Monster to Read" url="https://www.teachyourmonster.org/u/21640347" image="monster.png"/>
			<${Link} title="Money Drag" url="https://teacher.gynzy.com/en-us/board?content=745" image="homeschooling/money-drag.png"/>
			<${Link} title="Neighborhood Good" url="https://ed.icivics.org/node/1814/resource" image="NeighborhoodGood.png"/>
			<${Link} title="Letter Sounds" url="https://phonicsandstuff.com/phonemes" image="LetterSounds.png"/>
			<${Link} title="Kindergarten Math" url="https://www.ixl.com/math/kindergarten" image="KindergartenMath.png"/>
			<${Link} title="Pre-K Language Arts" url="https://www.ixl.com/ela/pre-k" image="PreKLanguageArts.png"/>
			<${Link} title="TypeTastic!" url="https://typetastic.com/learn.html" image="TypeTastic.png" style="br-20"/>
			<${Link} title="Internal Combustion Engine" url="https://ciechanow.ski/internal-combustion-engine/" image="InternalCombustionEngine.png"/>
			<${Link} title="Chrome Music Lab" url="https://musiclab.chromeexperiments.com/" image="ChromeMusicLab.png"/>
			<${Link} title="Google Earth" url="https://earth.google.com/" image="GoogleEarth.png" style="br-20"/>
			<${Link} title="Regular Tixy" url="https://www.mathsuniverse.com/tixy/" image="tixy.png" style="br-20"/>
			<${Link} title="Nathan's Tixy" url="tixy.html" image="nathan_tixy.png" style="br-20"/>
			<${Link} title="MolView" url="https://app.molview.com/" image="MolView.png"/>
			<${Link} title="Morpheme Mix" url="https://phonicsandstuff.com/puzzles/morpheme-mix/" image="MorphemeMix.png"/>
			<${Link} title="EdShed Letter Tiles" url="https://www.edshed.com/en-us/lettertiles" image="LetterTiles.png"/>
		<//>
		<${Section}>
			<${Link} title="Lode Runner Web Game" url="https://loderunnerwebgame.netlify.app/" image="LodeRunner.png"/>
			<${Link} title="Cut The Rope" url="https://www.crazygames.com/game/cut-the-rope-ebx/" image="CutTheRope.png"/>
			<${Link} title="Mario Teaches Typing" url="https://playclassic.games/games/educational-dos-games-online/play-mario-teaches-typing-online/play/" image="MarioTeachesTyping.png" style="br-10"/>
			<${Link} title="Snake Game" url="https://googlesnakemods.com/v/current/" image="SnakeGame.png"/>
		<//>
		<${Section}>
			<${Link} title="Custom Wordle" url="https://mywordle.strivemath.com//" image="CustomWordle.png"/>
			<${Link} title="Wordle" url="https://www.nytimes.com/games/wordle/index.html" image="Wordle.png"/>
			<${Link} title="Hello Wordl" url="https://hellowordl.net/" image="HelloWordl.png"/>
			<${Link} title="Nonograms" url="https://www.goobix.com/games/nonograms/" image="Nonograms.png"/>
			<${Link} title="Google Chat" url="https://mail.google.com/" image="GoogleChat.png"/>
		<//>
		<${Section}>
			<${Link} title="One Hundred Snowballs" url="https://www.ixl.com/games/one_hundred_snowballs" image="OneHundredSnowballs.png" style="br-10"/>
			<${Link} title="Birthday Candle Counting" url="https://www.ixl.com/games/birthday-candle-counting" image="BirthdayCandleCounting.png" style="br-10"/>
			<${Link} title="Count Snakes" url="https://www.ixl.com/games/base-ten-fun-count-write-ones-a" image="CountSnakes.png" style="br-10"/>
			<${Link} title="Counting Blocks Bingo" url="https://www.ixl.com/games/counting-blocks-bingo-ones-a" image="CountingBlocksBingo.png" style="br-5"/>
			<${Link} title="Counting Fish" url="https://www.ixl.com/games/counting_fish" image="CountingFish.png" style="br-5"/>
			<${Link} title="Fuzz Bugs: Counting, Sorting, Comparing" url="https://www.ixl.com/games/counting_sorting_comparing" image="FuzzBugsCountingSortingComparing.png" style="br-5"/>
			<${Link} title="Fuzz Bugs: Patterns" url="https://www.ixl.com/games/fuzz_bugs_patterns" image="FuzzBugsPatterns.png" style="br-5"/>
			<${Link} title="Monster Mansion: Number Match" url="https://www.ixl.com/games/monster-mansion-numbers-show-a" image="MonsterMansionNumberMatch.png" style="br-5"/>
			<${Link} title="Monster Mansion: Number Memory Match" url="https://www.ixl.com/games/monster-mansion-numbers-memory-a" image="MonsterMansionNumberMemoryMatch.png" style="br-5"/>
			<${Link} title="Number Bingo: 0 to 10" url="https://www.ixl.com/games/number-bingo-10-a" image="NumberBingo0To10.png" style="br-5"/>
			<${Link} title="Number Bingo: 0 to 20" url="https://www.ixl.com/games/number-bingo-20-a" image="NumberBingo0To20.png" style="br-5"/>
			<${Link} title="Math Man: Addition" url="https://www.ixl.com/games/math-man-addition-a" image="MathManAddition.jpg" style="br-5"/>
		<//>
		<${Section} noBorder>
			<${Link} title="Sight Word Bingo" url="https://www.ixl.com/games/sight-word-bingo-pre-primer-a" image="SightWordBingo.png" style="br-5"/>
			<${Link} title="Alphabet Bingo: Uppercase Letters" url="https://www.ixl.com/games/alphabet-bingo-names-uppercase-a" image="AlphabetBingoUppercaseLetters.png" style="br-5"/>
		<//>
	`;
}
