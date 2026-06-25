import { adminLoginController, userManagementController, childManagementController, gameLevelController, iconManagementController, imageManagementcontroller, gameController } from '@/Presentation/Factory/AdminFactory';
import { tokenService } from '@/Presentation/Factory/ParentFactory';
import { authHandler } from '@/Presentation/Middlewares/AuthMiddleware';
import { ROUTES } from '@/Shared/Routes';
import { upload } from '@/Infrastructure/Config/multer';
import  Express  from 'express';

const router = Express.Router();

router.post(ROUTES.ADMIN.LOGIN, adminLoginController.login );

router.use(  authHandler(tokenService) );
router.get( ROUTES.ADMIN.USER_MANAGEMENT.USERS.BASE, userManagementController.getAllUsers);
router.get(`${ROUTES.ADMIN.USER_MANAGEMENT.USERS.BASE}${ROUTES.ADMIN.USER_MANAGEMENT.USERS.BY_ID}`,
  userManagementController.getUserDetails
);
router.patch(`${ROUTES.ADMIN.USER_MANAGEMENT.USERS.BASE}${ROUTES.ADMIN.USER_MANAGEMENT.USERS.STATUS}`, userManagementController.toggleUserStatus );
router.patch(ROUTES.ADMIN.CHILD_MANAGEMENT.CHILDREN.STATUS, childManagementController.toggleStatus);

router.get(ROUTES.ADMIN.CHILD_MANAGEMENT.CHILDREN.BY_ID, childManagementController.childDetails);

router.post ( ROUTES.ADMIN.LEVEL_MANAGEMENT.CREATE, gameLevelController.addLevel );
router.get( ROUTES.ADMIN.LEVEL_MANAGEMENT.BY_GAME, gameLevelController.getLevelsByGame);
router.get( ROUTES.ADMIN.LEVEL_MANAGEMENT.BY_ID, gameLevelController.getLevel );
router.put( ROUTES.ADMIN.LEVEL_MANAGEMENT.BY_ID, gameLevelController.updateLevel );
router.patch( ROUTES.ADMIN.LEVEL_MANAGEMENT.STATUS, gameLevelController.changestatus );


router.post ( ROUTES.ADMIN.ICON_MANAGEMENT.CREATE, iconManagementController.addIcon );
router.get( ROUTES.ADMIN.ICON_MANAGEMENT.BASE, iconManagementController.getAllIcons );
router.get( ROUTES.ADMIN.ICON_MANAGEMENT.BY_ID, iconManagementController.getIcon);
router.delete( ROUTES.ADMIN.ICON_MANAGEMENT.BY_ID, iconManagementController.deleteIcon);


router.post( ROUTES.ADMIN.IMAGE_MANAGEMENT.CREATE,  upload.single("image"), imageManagementcontroller.addImage );
router.get( ROUTES.ADMIN.IMAGE_MANAGEMENT.BASE, imageManagementcontroller.getAllImages );
router.get( ROUTES.ADMIN.IMAGE_MANAGEMENT.BY_ID, imageManagementcontroller.getImage);
router.patch( ROUTES.ADMIN.IMAGE_MANAGEMENT.BY_ID,   upload.single("image"),  imageManagementcontroller.updateImage );
router.delete( ROUTES.ADMIN.IMAGE_MANAGEMENT.BY_ID, imageManagementcontroller.deleteImage );

router.get(ROUTES.ADMIN.GAME_MANAGEMENT.BASE, gameController.getAllGames);
router.get( ROUTES.ADMIN.GAME_MANAGEMENT.BY_ID, gameController.getGame );
router.patch( ROUTES.ADMIN.GAME_MANAGEMENT.STATUS, gameController.changeStatus)
export default router;