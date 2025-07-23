import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tiptap content types
interface TiptapTextNode {
  text: string
  type?: string
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>
}

interface TiptapContentNode {
  type: string
  content?: TiptapNode[]
  attrs?: Record<string, unknown>
  text?: string
}

type TiptapNode = TiptapTextNode | TiptapContentNode

// Simple descriptors that toddlers can understand (colors, shapes, numbers)
const DESCRIPTORS = [
  // Colors
  'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white',
  'gold', 'silver', 'gray', 'navy', 'teal', 'lime', 'magenta', 'ruby', 'indigo', 'violet',
  'turquoise', 'crimson', 'emerald', 'amber', 'rose', 'lavender', 'maroon', 'olive', 'cyan', 'peach',
  // Shapes
  'round', 'square', 'triangle', 'circle', 'oval', 'rectangle', 'star', 'heart', 'diamond', 'hexagon',
  'crescent', 'spiral', 'cross', 'arrow', 'moon', 'sun', 'cloud', 'flower', 'leaf',
  // Numbers (ordinal and cardinal)
  'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
  // Size descriptors
  'big', 'small', 'tiny', 'huge', 'giant', 'mini', 'large', 'little', 'enormous', 'petite',
  'massive', 'micro', 'jumbo', 'wee', 'mighty', 'puny', 'colossal', 'minuscule', 'titanic', 'dinky',
  // Speed descriptors
  'fast', 'slow', 'quick', 'speedy', 'swift', 'lazy', 'rapid', 'sluggish', 'brisk', 'leisurely',
  'hurried', 'relaxed', 'hasty', 'calm', 'rushed', 'peaceful', 'dashing', 'racing', 'serene',
  // Mood descriptors
  'happy', 'sad', 'angry', 'excited', 'sleepy', 'grumpy', 'cheerful', 'friendly', 'scared', 'brave',
  'joyful', 'lonely', 'furious', 'thrilled', 'tired', 'cranky', 'merry', 'kind', 'afraid', 'courageous',
  'giggly', 'melancholy', 'mad', 'delighted', 'drowsy', 'irritable', 'jolly', 'terrified', 'heroic',
  // Sound descriptors
  'loud', 'quiet', 'noisy', 'silent', 'shy', 'chatty', 'mysterious', 'booming', 'whispering', 'buzzing',
  'hushed', 'talkative', 'secretive', 'thundering', 'murmuring', 'humming', 'muted', 'gossipy', 'enigmatic', 'roaring',
  // Materials
  'wooden', 'metal', 'plastic', 'glass', 'paper', 'cloth', 'leather', 'rubber', 'stone', 'crystal',
  'cotton', 'silk', 'wool', 'brick', 'cement', 'golden', 'copper', 'iron', 'marble',
  'velvet', 'linen', 'denim', 'ceramic', 'concrete', 'bronze', 'aluminum', 'steel', 'granite', 'jade',
  // Weather/seasonal
  'sunny', 'rainy', 'snowy', 'windy', 'warm', 'cold', 'hot', 'cool', 'spring', 'summer', 'autumn', 'winter',
  'cloudy', 'stormy', 'foggy', 'breezy', 'mild', 'freezing', 'scorching', 'chilly', 'blossom', 'beach', 'harvest', 'frosty',
  // Time of day
  'morning', 'noon', 'evening', 'night', 'dawn', 'dusk', 'midnight', 'sunrise', 'sunset', 'daybreak',
  'afternoon', 'twilight', 'bedtime', 'wakeup', 'lunchtime', 'dinnertime', 'playtime', 'naptime', 'storytime', 'dreamtime',
  // Textures
  'smooth', 'rough', 'soft', 'hard', 'fuzzy', 'slippery', 'bumpy', 'fluffy', 'spiky', 'slimy',
  'silky', 'coarse', 'gentle', 'solid', 'woolly', 'greasy', 'lumpy', 'downy', 'sharp', 'gooey',
  'velvety', 'scratchy', 'tender', 'rigid', 'furry', 'oily', 'feathery', 'pointy', 'sticky',
  // Patterns
  'striped', 'spotted', 'dotted', 'wavy', 'zigzag', 'curly', 'straight', 'swirly', 'checkered', 'polka',
  'lined', 'speckled', 'flecked', 'curved', 'jagged', 'winding', 'bent', 'twisted', 'plaid', 'dashed',
  'banded', 'mottled', 'sprinkled', 'meandering', 'serrated', 'coiled', 'crooked', 'spiraled', 'tartan',
  // Actions/States
  'sleeping', 'dancing', 'singing', 'jumping', 'running', 'flying', 'swimming', 'climbing', 'digging', 'hiding',
  'playing', 'reading', 'drawing', 'building', 'cooking', 'cleaning', 'gardening', 'fishing', 'camping', 'exploring',
  // Positions
  'top', 'bottom', 'left', 'right', 'center', 'middle', 'front', 'back', 'inside', 'outside',
  'upstairs', 'downstairs', 'up', 'down', 'near', 'far', 'close', 'distant', 'high', 'low',
  'short', 'tall', 'wide', 'narrow', 'long',
  // Qualities
  'magical', 'ordinary', 'special', 'normal', 'unique', 'common', 'rare', 'unusual', 'strange', 'familiar', 'bizarre',
  'wonderful', 'boring', 'amazing', 'plain', 'fantastic', 'simple', 'incredible', 'basic', 'marvelous', 'regular',
  // Food-related
  'sweet', 'sour', 'salty', 'spicy', 'fresh', 'stale', 'juicy', 'dry', 'crunchy', 'chewy',
  'delicious', 'yucky', 'tasty', 'gross', 'yummy', 'scrumptious', 'mouthwatering', 'cheesy', 'savory', 'tangy', 'bitter',
  // Light/Glow
  'bright', 'dark', 'shiny', 'dull', 'glowing', 'dim', 'sparkly', 'gloomy', 'radiant', 'shadowy', 'radioactive',
  'luminous', 'murky', 'twinkling', 'overcast', 'brilliant', 'dusky', 'glittering', 'somber', 'dazzling', 'obscure',
]

// Simple animals that toddlers can recognize
const ANIMALS = [
  // Classic pets & farm animals
  'cat', 'dog', 'bird', 'fish', 'cow', 'pig', 'sheep', 'horse', 'duck', 'chicken',
  'rabbit', 'mouse', 'goat', 'donkey', 'turkey', 'goose', 'pony', 'hamster', 'calf',

  // Animal younglings
  'puppy', 'kitten', 'duckling', 'chick', 'piglet', 'lamb', 'foal', 'colt',
  'bunny', 'baby', 'cub', 'fawn', 'pup', 'joey', 'tadpole', 

  // Zoo & wild animals
  'bear', 'lion', 'tiger', 'elephant', 'monkey', 'giraffe', 'zebra', 'kangaroo', 'panda',
  'hippo', 'rhino', 'crocodile', 'alligator', 'camel', 'gorilla', 'leopard', 'cheetah', 'koala',

  // Woodland & forest animals
  'fox', 'wolf', 'deer', 'squirrel', 'raccoon', 'skunk', 'beaver', 'otter', 'hedgehog', 'moose',

  // Water & sea animals
  'seal', 'whale', 'dolphin', 'shark', 'octopus', 'crab', 'lobster', 'starfish', 'jellyfish', 'clam', 'shrimp', 'eel', 'seahorse',

  // Reptiles & amphibians
  'frog', 'turtle', 'snake', 'lizard', 'gecko', 'newt', 'toad',

  // Insects & bugs
  'bee', 'butterfly', 'spider', 'ant', 'ladybug', 'dragonfly', 'grasshopper', 'firefly', 'beetle', 'worm', 'bug', 'moth', 'caterpillar',

  // Birds
  'owl', 'eagle', 'parrot', 'flamingo', 'peacock', 'swan', 'robin', 'crow', 'woodpecker', 'pigeon', 'sparrow', 'finch', 'hawk',

  // Arctic & cold climate animals
  'walrus', 'reindeer', 'penguin', 'polar', 'orca',

  // Miscellaneous
  'bat', 'mole', 'platypus', 'armadillo', 'sloth', 'meerkat', 'lemur', 'yak', 'antelope', 'buffalo', 'ferret',
]

export function generateMemorableSlug(): string {
  const randomDescriptor = DESCRIPTORS[Math.floor(Math.random() * DESCRIPTORS.length)]
  const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
  return `${randomDescriptor}-${randomAnimal}`
}

/**
 * Extract plain text from TiptapContent for metadata and descriptions
 */
export function extractTextFromTiptapContent(content: TiptapNode | null | undefined): string {
  if (!content) return ''
  
  let text = ''
  
  // Handle text nodes
  if ('text' in content && content.text) {
    text += content.text
  }
  
  // Recursively process content array
  if ('content' in content && content.content && Array.isArray(content.content)) {
    for (const node of content.content) {
      const nodeText = extractTextFromTiptapContent(node)
      if (nodeText) {
        text += (text && !text.endsWith(' ') ? ' ' : '') + nodeText
      }
    }
  }
  
  return text.trim()
}

/**
 * Extract the title (first line or heading) from TiptapContent
 */
export function extractTitleFromTiptapContent(content: TiptapNode | null | undefined): string {
  if (!content || !('content' in content) || !content.content) return ''
  
  // Look for the first heading or paragraph with content
  for (const node of content.content) {
    if (node.type === 'heading' && 'content' in node && node.content) {
      const headingText = extractTextFromTiptapContent(node)
      if (headingText.trim()) {
        return headingText.trim()
      }
    }
    
    if (node.type === 'paragraph' && 'content' in node && node.content) {
      const paragraphText = extractTextFromTiptapContent(node)
      if (paragraphText.trim()) {
        // Return first line or first 60 characters as title
        const firstLine = paragraphText.split('\n')[0].trim()
        return firstLine.length > 60 ? firstLine.substring(0, 57) + '...' : firstLine
      }
    }
  }
  
  return ''
}

/**
 * Create a description from TiptapContent
 */
export function createDescriptionFromTiptapContent(content: TiptapNode | null | undefined, maxLength: number = 160): string {
  const fullText = extractTextFromTiptapContent(content)
  
  if (!fullText) {
    return 'A note created with Super Cute Notes - Fast, simple note taking.'
  }
  
  if (fullText.length <= maxLength) {
    return fullText
  }
  
  // Truncate at word boundary
  const truncated = fullText.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}
