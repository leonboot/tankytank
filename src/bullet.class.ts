import { Application, Assets, Sprite } from 'pixi.js';
import tankSprite from './sprites/bullet.png';

export class Bullet {

    private sprite?: Sprite;

    private speed: number = 20;

    constructor(private origin: {x: number, y: number}, private heading: number, application: Application) {
        Assets.load(tankSprite).then((tankBaseTexture) => {
            tankBaseTexture.baseTexture.scaleMode = 'nearest';
            this.sprite = new Sprite(tankBaseTexture);
            this.sprite.eventMode = 'static';
            this.sprite.anchor.set(0.5);
            this.sprite.scale.set(2);
            application.stage.addChild(this.sprite);
            this.sprite.zIndex = 150;
        });
    }

    public tick(): void
    {
        this.origin.x = this.origin.x - this.speed * Math.sin(-this.heading);
        this.origin.y = this.origin.y - this.speed * Math.cos(-this.heading);
        
        if (this.sprite) {
            this.sprite.x = this.origin.x;
            this.sprite.y = this.origin.y;
        }
    }

    public remove(application: Application): void {
        if (this.sprite) {
            application.stage.removeChild(this.sprite);
        }
    }
    
    get x(): number | null {
        return this.sprite?.x ?? null;
    }

    get y(): number | null {
        return this.sprite?.y ?? null;
    }
}