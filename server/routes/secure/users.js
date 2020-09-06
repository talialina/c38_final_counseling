const router = require('express').Router(),
  jwt = require('jsonwebtoken'),
  { sendCancellationEmail } = require('../../emails/index');
//cloudinary = require('cloudinary').v2;

//Get Current User
router.get('/api/users/:id', async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    console.log('No user, please login');
  }
});

// ***********************************************//
// Update a user
// ***********************************************//

router.patch('/api/users/me', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('ReqUser: ', req.user);
  let user;
  try {
    user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true
    });
  } catch (err) {
    console.log('Something went wrong. Could not update user', 500);
    return next(err);
  }
  user.name = name;
  user.email = email;
  uesr.password = password;
  try {
    await user.save();
  } catch (err) {
    console.log('Something went wrong. Could not update user', 500);
    return next(err);
  }
  res.status(200).json({ user: user.toObject({ getters: true }) });
});

//   const updates = Object.keys(req.body);
//   const allowedUpdates = ['name', 'email', 'password'];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );
//   if (!isValidOperation)
//     return res.status(400).send({ error: 'invalid updates!' });
//   try {
//     updates.forEach((update) => (req.user[update] = req.body[update]));
//     await req.user.save();
//     res.json(req.user);
//   } catch (e) {
//     res.status(400).json({ error: e.toString() });
//   }
// });

// router.patch('/api/users/:id', async (req, res => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ['name', 'email', 'password'];
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );
//   if (!isValidOperation)
//     return res.status(400).send({ error: 'invalid updates!' });
//   try {
//     updates.forEach((update) => (req.user[update] = req.body[update]));
//     await req.user.save();
//     res.json(req.user);
//   } catch (e) {
//     res.status(400).json({ error: e.toString() });
//   }
// });

// ***********************************************//
// Logout a user
// ***********************************************//
router.post('/api/users/logout', async (req, res) => {
  console.log(req.user);
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.clearCookie('jwt');
    res.json({ message: 'logged out!' });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
// ***********************************************//
// Logout all devices
// ***********************************************//
router.post('/api/users/logoutAll', async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.clearCookie('jwt');
    res.json({ message: 'all devices logged out' });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
// ***********************************************//
// Delete a user
// ***********************************************//
router.delete('/api/users/me', async (req, res) => {
  try {
    await req.user.remove();
    sendCancellationEmail(req.user.email, req.user.name);
    res.clearCookie('jwt');
    res.json({ message: 'user deleted' });
  } catch (error) {
    res.status(500).json({ error: e.toString() });
  }
});
//Upload Avatar to User
// TODO this is a placeholder route, it does not work yet
router.post('/api/users/avatar', async (req, res) => {
  const { image } = req.body;
  try {
    req.user.avatar = image;
    const updatedUser = await req.user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

// ******************************
// Update password
// ******************************
router.put('/api/password', async (req, res) => {
  try {
    req.user.password = req.body.password;
    await req.user.save();
    res.clearCookie('jwt');
    res.json({ message: 'password updated successfully' });
  } catch (e) {
    res.json({ error: e.toString() });
  }
});

module.exports = router;
