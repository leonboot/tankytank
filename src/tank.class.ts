import { Application, Assets, Sprite } from 'pixi.js';
import tankSprite from './sprites/tankBase.png';
import turretSprite from './sprites/tankTurret.png';
import { Bullet } from './bullet.class';

export class Tank {

    private tankBase: Sprite|null = null;

    private tankTurret: Sprite|null = null;

    private coordinates: {x: number, y: number} = {x: 0, y: 0};

    private heading: number = 0;

    private turretRotation = 0;

    private speed: number = 0;

    private bullets: Array<Bullet> = [];

    constructor(private application: Application) {
        this.initializeTank();
        this.initializeAnimationLoop();
    }

    public setPosition(x: number, y: number) {
        this.coordinates.x = x;
        this.coordinates.y = y;
    }

    public setSpeed(speed: number) {
        this.speed = speed * 5;
    }

    public updateHeading(modifier: number) {
        this.heading += (Math.PI * 2) + (modifier / 20) % (Math.PI * 2);
    }

    public rotateTurret(modifier: number) {
        this.turretRotation += (Math.PI * 2) + (modifier / 20) % (Math.PI * 2);
    }

    public fire(): void {
        this.bullets.push(new Bullet({...this.coordinates}, this.heading + this.turretRotation, this.application));
    }
    
    private initializeAnimationLoop(): void {
        this.application.ticker.add(() => {
            if (this.tankBase !== null) {
                this.tankBase.rotation =this.heading;
                
                this.coordinates.x = this.coordinates.x + this.speed * Math.sin(-this.tankBase.rotation);
                this.coordinates.y = this.coordinates.y + this.speed * Math.cos(-this.tankBase.rotation);
                
                this.tankBase.x = this.coordinates.x;
                this.tankBase.y = this.coordinates.y;

                if (this.tankTurret !== null) {
                    this.tankTurret.rotation = this.tankBase.rotation + this.turretRotation;
                    this.tankTurret.x = this.tankBase.x;
                    this.tankTurret.y = this.tankBase.y;
                }
            }
            this.bullets.forEach((bullet: Bullet, idx: number) => {
                bullet.tick();
                // Clean up out of bounds bullets
                if (
                    (bullet.x !== null && (bullet.x < -50 || bullet.x > this.application.canvas.width + 50)) ||
                    (bullet.y !== null && (bullet.y < -50 || bullet.y > this.application.canvas.height + 50))
                 ) {
                    this.bullets.splice(idx, 1);
                }
            });
        });
    }

    private initializeTank(): void {
        Assets.load(tankSprite).then((tankBaseTexture) => {
            tankBaseTexture.baseTexture.scaleMode = 'nearest';
            this.tankBase = new Sprite(tankBaseTexture);
            this.tankBase.eventMode = 'static';
            this.tankBase.anchor.set(0.5);
            this.tankBase.scale.set(3);
            this.application.stage.addChild(this.tankBase);
            this.tankBase.zIndex = 100;
        });
        Assets.load(turretSprite).then((asset) => {
            asset.baseTexture.scaleMode = 'nearest';
            this.tankTurret = new Sprite(asset);
            this.tankTurret.eventMode = 'static';
            this.tankTurret.anchor.set(0.5);
            this.tankTurret.scale.set(3);
            this.application.stage.addChild(this.tankTurret);
            this.tankTurret.zIndex = 200;
        });

    }
}