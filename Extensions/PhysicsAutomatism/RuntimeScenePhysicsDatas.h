/**

GDevelop - Physics Automatism Extension
Copyright (c) 2010-2015 Florian Rival (Florian.Rival@gmail.com)
This project is released under the MIT License.
*/

#ifndef RUNTIMESCENEPHYSICSDATAS_H
#define RUNTIMESCENEPHYSICSDATAS_H

class b2World;
class b2Body;
#include "GDCpp/AutomatismsRuntimeSharedData.h"
class ScenePhysicsDatas;
class ContactListener;

/**
 * Datas shared by Physics Automatism at runtime
 */
class RuntimeScenePhysicsDatas : public AutomatismsRuntimeSharedData
{
public:
    RuntimeScenePhysicsDatas(const ScenePhysicsDatas & automatismSharedDatas);
    virtual ~RuntimeScenePhysicsDatas();
    virtual std::shared_ptr<AutomatismsRuntimeSharedData> Clone() const { return std::shared_ptr<AutomatismsRuntimeSharedData>(new RuntimeScenePhysicsDatas(*this));}

    b2World * world;
    ContactListener * contactListener;
    b2Body * staticBody; ///< A simple static body with no fixture. Used for joints.
    bool stepped; ///< Used to be sure that Step is called only once at each frame.

    /**
     * Get the scale between world coordinates and scene pixels in x axis
     */
    inline float GetScaleX() const { return scaleX; }

    /**
     * Get the scale between world coordinates and scene pixels in y axis
     */
    inline float GetScaleY() const { return scaleY; }

    /**
     * Get inverse of scale X
     */
    inline float GetInvScaleX() const { return invScaleX; }

    /**
     * Get inverse of scale Y
     */
    inline float GetInvScaleY() const { return invScaleY; }

    /**
     * Call world->Step(), ensuring that the timeStep passed to Step() is fixed.
     * This method is to be called once a frame ( by PhysicsAutomatism ).
     */
    void StepWorld(float dt, int v, int p);

private:
    float scaleX;
    float scaleY;
    float invScaleX;
    float invScaleY;

    float fixedTimeStep; ///< Time step between to call to world->Step(...). Box2D need a fixed time step to ensure reliable simulation.
    unsigned int maxSteps; ///< Maximum steps per frames, to prevent slow down (a slow down will force the computer to make more steps which will force it to make even more steps...)

    float totalTime;
};

#endif // RUNTIMESCENEPHYSICSDATAS_H

