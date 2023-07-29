// const { Configuration, OpenAIApi } = require('openai');


// const configuration = new Configuration({
//   // apiKey: process.env.OPENAI_API_KEY,
  
//   apiKey: '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',
// });
// const openai = new OpenAIApi(configuration);

// const generateImage = async (req, res) => {
//   const { prompt, size } = req.body;

//   const imageSize =
//     size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';

//   try {
//     const response = await openai.createImage({
//       model: "image-alpha-001",
//       prompt,
//       n: 1,
//       size: imageSize,
//     });

//     const imageUrl = response.data.data[0].url;

//     res.status(200).json({
//       success: true,
//       data: imageUrl,
//     });
//   } catch (error) {
//     if (error.response) {
//       // console.log(OPENAI_API_KEY);
//       console.log(error.response.status);
//       console.log(error.response.data);
//     } else {
//       console.log(error.message);
//     }

//     res.status(400).json({
//       success: false,
//       error: 'The image could not be generated',
//     });
//   }
// };

// module.exports = { generateImage };

const { Configuration, OpenAIApi } = require('openai');
const NodeCache = require('node-cache');

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

const imageCache = new NodeCache({ stdTTL: 300, checkperiod: 600 });

const generateImage = async (req, res) => {
  const { prompt, size } = req.body;

  const imageSize =
    size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';

  try {
    // Check if the image is already cached
    const cachedImageUrl = imageCache.get(prompt);
    if (cachedImageUrl) {
      console.log('Serving image from cache');
      return res.status(200).json({
        success: true,
        data: cachedImageUrl,
      });
    }

    // Generate the image
    const response = await openai.createImage({
      model: 'image-alpha-001',
      prompt,
      n: 1,
      size: imageSize,
    });
    const imageUrl = response.data.data[0].url;

    // Cache the image for future requests
    imageCache.set(prompt, imageUrl);

    res.status(200).json({
      success: true,
      data: imageUrl,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      error: 'The image could not be generated',
    });
  }
};

module.exports = { generateImage };
